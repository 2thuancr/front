'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { productAPI, cartApi } from '@/lib/api';
import Link from 'next/link';
import { ProductCard } from '@/components/ui';
import { LegacyProduct } from '@/types/api';
import { useToastSuccess, useToastError } from '@/components/ui/Toast';
import { useUserId } from '@/hooks/useUserId';
import { useAuth } from '@/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { toggleWishlist } from '@/store/wishlistSlice';
import { TrendingUp, Eye as EyeIcon, Percent, Clock } from 'lucide-react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { motion } from 'framer-motion';
import SearchSuggestions from '@/components/ui/SearchSuggestions';

type ProductType = 'latest' | 'bestseller' | 'most-viewed' | 'highest-discount';

export default function ProductsPage() {
  const [products, setProducts] = useState<LegacyProduct[]>([]);
  const [limit, setLimit] = useState(6);
  const [filterLoading, setFilterLoading] = useState(false);
  const [cartId, setCartId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<ProductType>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = useUserId();
  const { isAuthenticated, user } = useAuth();
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();
  const dispatch = useDispatch<AppDispatch>();

  const productTypes = [
    {
      value: 'latest' as ProductType,
      label: 'Sản phẩm mới nhất',
      icon: Clock,
      description: 'Những sản phẩm mới được thêm vào'
    },
    {
      value: 'bestseller' as ProductType,
      label: 'Sản phẩm bán chạy',
      icon: TrendingUp,
      description: 'Sản phẩm được mua nhiều nhất'
    },
    {
      value: 'most-viewed' as ProductType,
      label: 'Sản phẩm xem nhiều',
      icon: EyeIcon,
      description: 'Sản phẩm được xem nhiều nhất'
    },
    {
      value: 'highest-discount' as ProductType,
      label: 'Khuyến mãi cao nhất',
      icon: Percent,
      description: 'Sản phẩm có giảm giá cao nhất'
    }
  ];

  const quantityOptions = [
    { label: '6 sản phẩm', value: 6 },
    { label: '12 sản phẩm', value: 12 },
    { label: '18 sản phẩm', value: 18 },
    { label: '24 sản phẩm', value: 24 },
    { label: '30 sản phẩm', value: 30 }
  ];

  // Helper function to get current product type info
  const getCurrentProductType = () => {
    return productTypes.find(type => type.value === selectedType) || productTypes[0];
  };

  // Convert API Product to LegacyProduct format
  const convertToLegacyProduct = (product: any): LegacyProduct => {
    // Find primary image - handle both boolean and number types for isPrimary
    const primaryImage = product.images?.find((img: any) => 
      Boolean(img.isPrimary) || img.isPrimary === 1
    );
    const imageUrl = primaryImage?.imageUrl || product.images?.[0]?.imageUrl || '/images/hcmute-logo.png';
    const price = parseFloat(product.price);
    const discountPercent = product.discountPercent ? parseFloat(product.discountPercent) : 0;
    const originalPrice = discountPercent > 0 ? price / (1 - discountPercent / 100) : undefined;

    // Use totalViews if available (for most-viewed products)
    const viewCount = product.totalViews || Math.floor(Math.random() * 100) + 10;
    
    return {
      id: product.productId,
      name: product.productName,
      description: product.description,
      price: price,
      originalPrice: originalPrice || price,
      rating: 4.5, // Default rating since not in API
      reviewCount: viewCount, // Use totalViews for most-viewed, random for others
      image: imageUrl,
      images: product.images?.map((img: any) => img.imageUrl) || [],
      category: product.category.categoryName,
      categoryId: product.categoryId,
      isNew: false,
      isHot: false,
      discount: discountPercent > 0 ? Math.round(discountPercent) : 0,
      stock: product.stockQuantity,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  };

  // Handle search query from URL
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
      setIsSearchMode(true);
    } else {
      setSearchQuery('');
      setIsSearchMode(false);
    }
  }, [searchParams]);

  // Handle search function
  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      setSearchQuery(query);
      setIsSearchMode(true);
      // Update URL without page reload
      const params = new URLSearchParams(searchParams.toString());
      params.set('search', query);
      router.push(`/products?${params.toString()}`, { scroll: false });
    } else {
      setSearchQuery('');
      setIsSearchMode(false);
      // Remove search param from URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete('search');
      const newUrl = params.toString() ? `/products?${params.toString()}` : '/products';
      router.push(newUrl, { scroll: false });
    }
  }, [searchParams, router]);

  // Lấy cartId khi userId thay đổi và user đã đăng nhập
  useEffect(() => {
    const fetchCart = async () => {
      // Chỉ fetch cart khi user đã đăng nhập và có userId hợp lệ
      if (!isAuthenticated || !userId || userId <= 0) {
        setCartId(null);
        return;
      }

      try {
        const cart = await cartApi.getCartByUser(userId);

        if (cart && cart.cartId) {
          setCartId(cart.cartId);
        } else {
          console.warn("⚠️ Cart data is invalid:", cart);
        }
      } catch (error: any) {
        console.error("❌ Lỗi khi lấy giỏ hàng:", error);
        
        // Thử tạo giỏ hàng mới nếu không tìm thấy
        if (error.response?.status === 404) {
          try {
            const newCart = await cartApi.createCart(userId);
            if (newCart && newCart.cartId) {
              setCartId(newCart.cartId);
            }
          } catch (createError: any) {
          }
        } else if (error.response?.status === 401) {
          console.warn("🔒 Unauthorized - user may need to login again");
          // Không cần xử lý gì thêm, chỉ log warning
        }
      }
    };

    fetchCart();
  }, [userId, isAuthenticated]);

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      toastError("Cần đăng nhập", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }

    if (!userId || userId <= 0) {
      toastError("Lỗi đăng nhập", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }
    if (!cartId) {
      toastError("Lỗi giỏ hàng", "Không tìm thấy giỏ hàng. Vui lòng đăng nhập để sử dụng giỏ hàng.");
      return;
    }

    try {
      const res = await cartApi.addToCart(cartId, productId, 1);
      toastSuccess("Thành công!", "Đã thêm sản phẩm vào giỏ hàng");
    } catch (error: any) {
      if (error.response) {
        console.error("❌ AddToCart API Error Details:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          url: error.config?.url,
          requestData: { cartId, productId, quantity: 1 }
        });
        
        // Handle specific error cases
        if (error.response.status === 400) {
          console.warn("⚠️ Add to cart endpoint may not exist or requires different parameters");
        } else if (error.response.status === 401) {
          console.warn("⚠️ User not authenticated for cart operations");
        } else if (error.response.status === 404) {
          console.warn("⚠️ Cart or product not found");
        }
      }
      
      const errorMessage = error.response?.data?.message || error.message || "Thêm giỏ hàng thất bại";
      toastError("Thất bại", errorMessage);
    }
  };

  // Removed observer logic - no pagination needed

  // Separate useEffect for initial load and filter changes
  useEffect(() => {
    const fetchProducts = async () => {
      setFilterLoading(true);
      setProducts([]); // Clear existing products when filter changes
      
      try {
        let response;
        
        if (isSearchMode && searchQuery.trim()) {
          // Use search API when in search mode
          response = await productAPI.search({
            q: searchQuery,
            page: 1,
            limit: limit
          });
        } else {
          // Use regular product APIs when not searching
          switch (selectedType) {
            case 'latest':
              response = await productAPI.getLatestProducts(limit);
              break;
            case 'bestseller':
              response = await productAPI.getBestsellerProducts(limit);
              break;
            case 'most-viewed':
              response = await productAPI.getMostViewedProducts(limit);
              break;
            case 'highest-discount':
              response = await productAPI.getHighestDiscountProducts(limit);
              break;
            default:
              response = await productAPI.getLatestProducts(limit);
          }
        }
        
        // Handle different response structures
        let productsData;
        if (isSearchMode && searchQuery.trim()) {
          // Search API now returns { data: [...], meta: {...} } directly
          productsData = response.data || [];
        } else {
          // Regular APIs return different structures
          productsData = Array.isArray(response.data) ? response.data : (response.data.data || response.data);
        }
        
        const convertedProducts = productsData.map(convertToLegacyProduct);
        setProducts(convertedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setFilterLoading(false);
      }
    };

    fetchProducts();
  }, [selectedType, limit, isSearchMode, searchQuery]); // Include search dependencies

  // Remove pagination useEffect - use same approach as ProductGrid
  // No pagination needed, just load products once per filter change


  if (filterLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Đang tải sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!filterLoading && products.length === 0) {
    return (
      <div className="text-center py-8 text-red-500">
        Không có sản phẩm nào
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Sản Phẩm HCMUTE
        </h1>
        <div className="mt-6 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="max-w-2xl mx-auto">
          <SearchSuggestions 
            className="w-full"
            placeholder="Tìm kiếm sản phẩm..."
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* Modern Filter Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Left Side - Filter Dropdown */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Loại sản phẩm:</span>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value as ProductType);
                setIsSearchMode(false);
                setSearchQuery('');
                // Clear search from URL when changing filter
                const params = new URLSearchParams(searchParams.toString());
                params.delete('search');
                const newUrl = params.toString() ? `/products?${params.toString()}` : '/products';
                router.push(newUrl, { scroll: false });
              }}
              disabled={isSearchMode}
              className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-[200px] ${
                isSearchMode ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            >
              {productTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Center - Display Options */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Hiển thị:</span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {quantityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Right Side - View Mode */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Chế độ xem:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }`}
                title="Xem dạng lưới"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }`}
                title="Xem dạng danh sách"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Info */}
      {isSearchMode && searchQuery && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-blue-700 font-medium">
                Kết quả tìm kiếm cho: "{searchQuery}"
              </span>
              <span className="text-blue-600 text-sm">
                ({products.length} sản phẩm)
              </span>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchMode(false);
                const params = new URLSearchParams(searchParams.toString());
                params.delete('search');
                const newUrl = params.toString() ? `/products?${params.toString()}` : '/products';
                router.push(newUrl, { scroll: false });
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Xóa tìm kiếm
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          : 'grid-cols-1'
      }`}>
        {products.map((product: LegacyProduct) => (
          <div key={product.id}>
            <ProductCard 
              product={product}
              onAddToCart={handleAddToCart}
              onToggleWishlist={async (productId: number) => {
                if (!isAuthenticated) {
                  toastError("Cần đăng nhập", "Vui lòng đăng nhập để sử dụng tính năng yêu thích");
                  return;
                }

                if (!userId || userId <= 0) {
                  toastError("Cần đăng nhập", "Vui lòng đăng nhập để sử dụng tính năng yêu thích");
                  return;
                }

                try {
                  const result = await dispatch(toggleWishlist(productId)).unwrap();
                  
                  if (result.action === 'added') {
                    toastSuccess("Thành công!", "Đã thêm sản phẩm vào danh sách yêu thích");
                  } else if (result.action === 'removed') {
                    toastSuccess("Thành công!", "Đã bỏ sản phẩm khỏi danh sách yêu thích");
                  } else if (result.action === 'already_exists') {
                    toastSuccess("Thông báo", "Sản phẩm đã có trong danh sách yêu thích");
                  }
                } catch (error: any) {
                  console.error("❌ Lỗi khi toggle wishlist:", error);
                  const errorMessage = error.message || "Thao tác yêu thích thất bại";
                  toastError("Thất bại", errorMessage);
                }
              }}
            />
          </div>
        ))}
      </div>

      {/* No pagination loading indicator - removed pagination */}
    </div>
  );
}
