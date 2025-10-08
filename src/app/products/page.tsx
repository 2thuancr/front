'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { productAPI } from '@/lib/api';
import Link from 'next/link';
import { WishlistButton } from '@/components/ui';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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

        setProducts(prev => {
          const allProducts = [...prev, ...newProducts];
          const uniqueProducts = Array.from(
            new Map(allProducts.map(p => [p.productId, p])).values()
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
        {products.map((product: any, index: number) => {
          const isLast = index === products.length - 1;
          return (
            <div
              key={product.productId}
              ref={isLast ? lastProductRef : null}
              className="group border rounded-2xl shadow hover:shadow-lg overflow-hidden transition relative"
            >
              <Link href={`/products/${product.productId}`}>
                <div className="relative">
                  <img
                    src={product.images?.[0]?.imageUrl || '/no-image.png'}
                    alt={product.productName}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform"
                  />
                  {product.stockQuantity <= 0 && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      Hết hàng
                    </span>
                  )}
                </div>
              </Link>
              
              {/* Wishlist Button */}
              <div className="absolute top-2 right-2">
                <WishlistButton 
                  productId={product.productId} 
                  size="sm" 
                  variant="ghost"
                  className="bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="p-4">
                <Link href={`/products/${product.productId}`}>
                  <h2 className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-blue-600">
                    {product.productName}
                  </h2>
                </Link>
                <p className="text-red-500 font-bold text-xl mb-1">
                  {Number(product.price).toLocaleString()}₫
                </p>
                <p className="text-sm text-gray-500">
                  {product.stockQuantity > 0
                    ? `Còn ${product.stockQuantity} sản phẩm`
                    : 'Hết hàng'}
                </p>
              </div>
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
