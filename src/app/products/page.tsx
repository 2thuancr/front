'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { productAPI } from '@/lib/api';
import Link from 'next/link';
import { ProductCard } from '@/components/ui';
import { LegacyProduct } from '@/types/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<LegacyProduct[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Convert API Product to LegacyProduct format
  const convertToLegacyProduct = (product: any): LegacyProduct => {
    const primaryImage = product.images?.find((img: any) => 
      Boolean(img.isPrimary) || img.isPrimary === 1
    );
    const imageUrl = primaryImage?.imageUrl || product.images?.[0]?.imageUrl || '/images/hcmute-logo.png';
    const price = parseFloat(product.price);
    const discountPercent = product.discountPercent ? parseFloat(product.discountPercent) : 0;
    const originalPrice = discountPercent > 0 ? price / (1 - discountPercent / 100) : undefined;

    return {
      id: product.productId,
      name: product.productName,
      description: product.description,
      price: price,
      originalPrice: originalPrice,
      rating: 4.5, // Default rating since not in API
      reviewCount: Math.floor(Math.random() * 100) + 10, // Random for demo
      image: imageUrl,
      images: product.images?.map((img: any) => img.imageUrl) || [],
      category: product.category.categoryName,
      categoryId: product.categoryId,
      isNew: false,
      isHot: false,
      discount: discountPercent > 0 ? Math.round(discountPercent) : undefined,
      stock: product.stockQuantity,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
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
                onAddToCart={(productId) => console.log('Add to cart:', productId)}
                onToggleWishlist={(productId) => console.log('Toggle wishlist:', productId)}
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
