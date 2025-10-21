'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
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

export default function ProductsPage() {
  const [products, setProducts] = useState<LegacyProduct[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cartId, setCartId] = useState<number | null>(null);
  
  const userId = useUserId();
  const { isAuthenticated, user } = useAuth();
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();
  const dispatch = useDispatch<AppDispatch>();

  // Convert API Product to LegacyProduct format
  const convertToLegacyProduct = (product: any): LegacyProduct => {
    const primaryImage = product.images?.find((img: any) => 
      Boolean(img.isPrimary) || img.isPrimary === 1
    );
    const imageUrl = primaryImage?.imageUrl || product.images?.[0]?.imageUrl || '/images/hcmute-logo.png';
    const price = parseFloat(product.price);
    const discountPercent = product.discountPercent ? parseFloat(product.discountPercent) : 0;
    const originalPrice = discountPercent > 0 ? price / (1 - discountPercent / 100) : undefined;

    const result: any = {
      id: product.productId,
      name: product.productName,
      description: product.description,
      price: price,
      rating: 4.5, // Default rating since not in API
      reviewCount: Math.floor(Math.random() * 100) + 10, // Random for demo
      image: imageUrl,
      images: product.images?.map((img: any) => img.imageUrl) || [],
      category: product.category.categoryName,
      categoryId: product.categoryId,
      isNew: false,
      isHot: false,
      stock: product.stockQuantity,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
    
    if (originalPrice !== undefined) {
      result.originalPrice = originalPrice;
    }
    
    if (discountPercent > 0) {
      result.discount = Math.round(discountPercent);
    }
    
    return result;
  };

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

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0]?.isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });


      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getAllProducts({ page, limit });
        const newProducts = res.data.products || [];
        const convertedProducts = newProducts.map(convertToLegacyProduct);

        setProducts(prev => {
          const allProducts = [...prev, ...convertedProducts];
          const uniqueProducts = Array.from(
            new Map(allProducts.map(p => [p.id, p])).values()
          );
          return uniqueProducts;
        });

        setHasMore(newProducts.length > 0);
      } catch (error) {
        // Error handled
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit]);


  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-8 text-red-500">
        Không có sản phẩm nào
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Danh sách sản phẩm
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product: LegacyProduct, index: number) => {
          const isLast = index === products.length - 1;
          return (
            <div key={product.id} ref={isLast ? lastProductRef : null}>
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
          );
        })}
      </div>

      {loading && (
        <div className="text-center py-6 text-gray-500">Đang tải...</div>
      )}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-6 text-gray-400">
          Bạn đã xem hết sản phẩm ({products.length})
        </div>
      )}
    </div>
  );
}
