'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Eye as EyeIcon, Percent, Clock } from 'lucide-react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { motion } from 'framer-motion';
import { productAPI, cartApi } from '@/lib/api';
import { Product, LegacyProduct } from '@/types/api';
import { ProductCard } from '@/components/ui';
import Link from 'next/link';
import { useToastSuccess, useToastError } from '@/components/ui/Toast';
import { useUserId } from '@/hooks/useUserId';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { toggleWishlist } from '@/store/wishlistSlice';

type ProductType = 'latest' | 'bestseller' | 'most-viewed' | 'highest-discount';

const ProductGrid: React.FC = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [products, setProducts] = useState<LegacyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState<ProductType>('latest');
  const [productCount, setProductCount] = useState(8);
  const [cartId, setCartId] = useState<number | null>(null);
  
  const userId = useUserId();
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();
  
  // Check authentication status from Redux
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const authToken = useSelector((state: RootState) => state.auth.token);
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
    { label: '4 sản phẩm', value: 4 },
    { label: '8 sản phẩm', value: 8 },
    { label: '12 sản phẩm', value: 12 },
    { label: '16 sản phẩm', value: 16 },
    { label: '20 sản phẩm', value: 20 }
  ];

  // Helper function to get current product type info
  const getCurrentProductType = () => {
    return productTypes.find(type => type.value === selectedType) || productTypes[0] || {
      label: 'Sản phẩm',
      description: 'Khám phá bộ sưu tập sản phẩm độc đáo với thiết kế riêng biệt dành cho sinh viên HCMUTE',
      value: 'latest' as ProductType,
      icon: Clock
    };
  };

  // Lấy cartId khi userId thay đổi
  useEffect(() => {
    const fetchCart = async () => {
      if (!userId || userId <= 0) {
        console.log("👤 Guest user - skipping cart fetch");
        setCartId(null);
        return;
      }

      // Check if user is actually authenticated
      if (!isAuthenticated || !authToken) {
        console.log("🔒 User not authenticated - skipping cart fetch");
        setCartId(null);
        return;
      }

      try {
        console.log("🛒 Lấy giỏ hàng cho user:", userId);
        const cart = await cartApi.getCartByUser(userId);
        console.log("✅ Dữ liệu giỏ hàng:", cart);

        if (cart && cart.cartId) {
          setCartId(cart.cartId);
        } else {
          console.warn("⚠️ Cart data is invalid:", cart);
        }
      } catch (error: any) {
        console.warn("⚠️ Cart API not available yet:", error.response?.status);
        
        // Handle specific error cases
        if (error.response?.status === 401) {
          console.log("🔒 User not authenticated for cart access");
        } else if (error.response?.status === 404) {
          console.log("📦 No cart found for user");
        } else {
          console.log("🚫 Cart endpoint not implemented yet");
        }
        
        // Thử tạo giỏ hàng mới nếu không tìm thấy
        if (error.response?.status === 404) {
          console.log("🛒 Cart not found, attempting to create new cart for user:", userId);
          try {
            const newCart = await cartApi.createCart(userId);
            console.log("✅ Created new cart:", newCart);
            if (newCart && newCart.cartId) {
              setCartId(newCart.cartId);
            }
          } catch (createError: any) {
            console.error("❌ Failed to create cart:", createError);
          }
        }
      }
    };

    fetchCart();
  }, [userId, isAuthenticated, authToken]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
     
        
        let response;
        switch (selectedType) {
          case 'latest':
            response = await productAPI.getLatestProducts(productCount);
            break;
          case 'bestseller':
            response = await productAPI.getBestsellerProducts(productCount);
            break;
          case 'most-viewed':
            response = await productAPI.getMostViewedProducts(productCount);
            break;
          case 'highest-discount':
            response = await productAPI.getHighestDiscountProducts(productCount);
            break;
          default:
            response = await productAPI.getLatestProducts(productCount);
        }
        
        // Handle different response structures
        const productsData = Array.isArray(response.data) ? response.data : (response.data.data || response.data);
        
        // Transform API response to match component expectations
        const transformedProducts: LegacyProduct[] = productsData.map((product: Product, index: number) => {
          // Find primary image - handle both boolean and number types for isPrimary
          const primaryImage = product.images?.find(img => 
            Boolean(img.isPrimary) || img.isPrimary === 1
          );
          const imageUrl = primaryImage?.imageUrl || product.images?.[0]?.imageUrl || '/images/hcmute-logo.png';
          const price = parseFloat(product.price);
          const discountPercent = product.discountPercent ? parseFloat(product.discountPercent) : 0;
          const originalPrice = discountPercent > 0 ? price / (1 - discountPercent / 100) : undefined;

          // Use totalViews if available (for most-viewed products)
          const viewCount = (product as any).totalViews || Math.floor(Math.random() * 100) + 10;
          
          return {
            id: product.productId,
            name: product.productName,
            description: product.description,
            price: price,
            originalPrice: originalPrice,
            rating: 4.5, // Default rating since not in API
            reviewCount: viewCount, // Use totalViews for most-viewed, random for others
            image: imageUrl,
            images: product.images?.map(img => img.imageUrl) || [],
            category: product.category.categoryName,
            categoryId: product.categoryId,
            isNew: false,
            isHot: false,
            discount: discountPercent > 0 ? Math.round(discountPercent) : undefined,
            stock: product.stockQuantity,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
          };
        });

        setProducts(transformedProducts);
      } catch (err: any) {
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        setProducts([
          // ...mock data như cũ...
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedType, productCount]);

  const toggleLocalWishlist = (productId: number) => {
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

  const handleAddToCart = async (productId: number) => {
    console.log("🔥 handleAddToCart được gọi từ ProductGrid!", { productId, cartId, userId });

    if (!userId || userId <= 0) {
      console.log("❌ Không có userId:", userId);
      toastError("Lỗi đăng nhập", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }
    if (!cartId) {
      console.log("❌ Không có cartId:", cartId);
      toastError("Lỗi giỏ hàng", "Không tìm thấy giỏ hàng. Vui lòng đăng nhập để sử dụng giỏ hàng.");
      return;
    }

    try {
      console.log("🔄 Gọi API cartApi.addToCart");
      const res = await cartApi.addToCart(cartId, productId, 1);
      console.log("✅ API addToCart response:", res);
      toastSuccess("Thành công!", "Đã thêm sản phẩm vào giỏ hàng");
    } catch (error: any) {
      console.error("❌ Lỗi khi thêm giỏ hàng:", error);
      
      // Log detailed error information
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

  const handleToggleWishlist = async (productId: number) => {
    console.log("🔥 handleToggleWishlist được gọi từ ProductGrid!", { productId, userId });

    if (!userId || userId <= 0) {
      toastError("Cần đăng nhập", "Vui lòng đăng nhập để sử dụng tính năng yêu thích");
      return;
    }

    try {
      console.log("🔄 Gọi Redux toggleWishlist");
      const result = await dispatch(toggleWishlist(productId)).unwrap() as any;
      console.log("✅ Toggle wishlist result:", result);
      
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
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {getCurrentProductType()?.label || 'Sản phẩm'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {getCurrentProductType()?.description || 'Khám phá bộ sưu tập sản phẩm độc đáo với thiết kế riêng biệt dành cho sinh viên HCMUTE'}
            </p>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">Đang tải sản phẩm...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {getCurrentProductType()?.label || 'Sản phẩm'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {getCurrentProductType()?.description || 'Khám phá bộ sưu tập sản phẩm độc đáo với thiết kế riêng biệt dành cho sinh viên HCMUTE'}
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Product Type Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {productTypes.map((type) => {
            const IconComponent = type.icon;
            const isActive = selectedType === type.value;
            return (
              <Button
                key={type.value}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 transform ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg scale-105 border-2 border-blue-700'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 hover:scale-105'
                }`}
                onClick={() => setSelectedType(type.value)}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>
                  {type.label}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          {/* Quantity Selector */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Hiển thị:</span>
            <Dropdown
              value={productCount}
              onChange={(e) => setProductCount(e.value)}
              options={quantityOptions}
              className="w-40"
              placeholder="Chọn số lượng"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              icon={<div className="grid grid-cols-2 gap-1 w-4 h-4"><div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div></div>}
              className={`p-3 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-600'}`}
              onClick={() => setViewMode('grid')}
              tooltip="Xem dạng lưới"
            />
            <Button
              icon={<div className="w-4 h-4 space-y-1"><div className="bg-current rounded-sm h-1"></div><div className="bg-current rounded-sm h-1"></div><div className="bg-current rounded-sm h-1"></div></div>}
              className={`p-3 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-600'}`}
              onClick={() => setViewMode('list')}
              tooltip="Xem dạng danh sách"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}>
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button
            outlined
            label="Xem thêm sản phẩm"
            className="px-8 py-3"
          />
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;