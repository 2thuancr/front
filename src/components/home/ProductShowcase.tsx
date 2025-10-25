'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { productAPI, cartApi } from '@/lib/api';
import { Product } from '@/types/api';
import { useAuth } from '@/hooks/useAuth';
import { useUserId } from '@/hooks/useUserId';
import { useToastSuccess, useToastError } from '@/components/ui/Toast';

// Convert API Product to display format
const convertProductForDisplay = (product: Product) => {
  // Shorten description to about 3 lines (around 150 characters)
  let shortDescription = product.description || 'Sản phẩm chất lượng cao với logo HCMUTE độc đáo.';
  if (shortDescription.length > 150) {
    shortDescription = shortDescription.substring(0, 150).trim() + '...';
  }
  
  return {
    id: product.productId,
    name: product.productName,
    description: shortDescription,
    price: parseFloat(product.price),
    image: product.images?.[0]?.imageUrl || '/images/placeholder.svg',
    category: product.category?.categoryName || 'Sản phẩm',
    rating: 4.5, // Default rating since API doesn't provide this
    reviews: product.reviews?.length || 0,
    features: [
      product.category?.categoryName || 'Sản phẩm HCMUTE',
      'Logo HCMUTE độc đáo',
      'Chất lượng cao',
      'Thiết kế đẹp mắt'
    ]
  };
};

const ProductShowcase: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartId, setCartId] = useState<number | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  
  const { isAuthenticated, token } = useAuth();
  const userId = useUserId();
  const router = useRouter();
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  // Fetch cart ID when user is authenticated
  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated || !userId || userId <= 0) {
        setCartId(null);
        return;
      }

      try {
        const response = await cartApi.getCartByUser(userId);
        if (response && response.cartId) {
          setCartId(response.cartId);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCartId(null);
      }
    };

    fetchCart();
  }, [userId, isAuthenticated]);

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch best-selling products from API
        const response = await productAPI.getBestSelling(4);
        
        console.log('API Response:', response.data);
        
        // Handle different response structures
        let productsData: Product[] = [];
        if (Array.isArray(response.data)) {
          productsData = response.data;
        } else if (response.data.data) {
          productsData = response.data.data;
        } else if (response.data.products) {
          productsData = response.data.products;
        }
        
        // If we don't have enough products, try to get more from other endpoints
        if (productsData.length < 4) {
          console.log(`Only got ${productsData.length} products, trying to get more...`);
          
          try {
            // Try to get latest products to fill the gap
            const latestResponse = await productAPI.getLatest(4 - productsData.length);
            let latestProducts: Product[] = [];
            
            if (Array.isArray(latestResponse.data)) {
              latestProducts = latestResponse.data;
            } else if (latestResponse.data.data) {
              latestProducts = latestResponse.data.data;
            } else if (latestResponse.data.products) {
              latestProducts = latestResponse.data.products;
            }
            
            // Filter out duplicates and add to productsData
            const existingIds = productsData.map(p => p.productId);
            const newProducts = latestProducts.filter(p => !existingIds.includes(p.productId));
            productsData = [...productsData, ...newProducts];
            
            console.log(`Added ${newProducts.length} more products. Total: ${productsData.length}`);
          } catch (latestErr) {
            console.warn('Could not fetch additional products:', latestErr);
          }
        }
        
        console.log('Final products data:', productsData);
        console.log('Final number of products:', productsData.length);
        
        // Convert to display format
        const displayProducts = productsData.map(convertProductForDisplay);
        console.log('Display products:', displayProducts);
        setProducts(displayProducts);
        
      } catch (err: any) {
        console.error('Error fetching best-selling products:', err);
        setError('Không thể tải sản phẩm bán chạy');
        
        // Fallback to empty array
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellingProducts();
  }, []);

  // Handle add to cart functionality
  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      toastError("Cần đăng nhập", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      router.push('/login');
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

    setAddingToCart(productId);
    try {
      const res = await cartApi.addToCart(cartId, productId, 1);
      toastSuccess("Thành công!", "Đã thêm sản phẩm vào giỏ hàng");
    } catch (error: any) {
      console.error("❌ Lỗi khi thêm giỏ hàng:", error);
      
      if (error.response) {
        console.error("❌ AddToCart API Error Details:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          url: error.config?.url,
          requestData: { cartId, productId, quantity: 1 }
        });
        
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
    } finally {
      setAddingToCart(null);
    }
  };

  // Handle view product details
  const handleViewDetails = (productId: number) => {
    router.push(`/products/${productId}`);
  };

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

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải sản phẩm bán chạy...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-500">Không có sản phẩm bán chạy nào</p>
          </div>
        </div>
      </section>
    );
  }

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
            Sản Phẩm Bán Chạy
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Những sản phẩm được yêu thích nhất với logo HCMUTE, được khách hàng tin tưởng lựa chọn
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
                    {product.features.map((feature: string, idx: number) => (
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
                  <button 
                    onClick={() => handleAddToCart(product.id)}
                    disabled={addingToCart === product.id}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingToCart === product.id ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Đang thêm...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Thêm vào giỏ
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => handleViewDetails(product.id)}
                    className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
                  >
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
