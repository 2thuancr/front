'use client';

import React, { useEffect, useState } from 'react';
import { productAPI } from '@/lib/api';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await productAPI.getAll();
        const productsData = res.data.products || [];
        setProducts(productsData);
      } catch (error) {
        console.error("Lỗi khi load danh sách sản phẩm:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-8">Đang tải...</div>;
  if (!products || products.length === 0) {
    return <div className="text-center py-8 text-red-500">Không có sản phẩm nào</div>;
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Danh sách sản phẩm</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product: any) => (
          <Link
            key={product.productId}
            href={`/products/${product.productId}`}
            className="group border rounded-2xl shadow hover:shadow-lg overflow-hidden transition"
          >
            <div className="relative">
              <img
                src={product.images?.[0]?.imageUrl || "/no-image.png"}
                alt={product.productName}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform"
              />
              {product.stockQuantity <= 0 && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  Hết hàng
                </span>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-blue-600">
                {product.productName}
              </h2>
              <p className="text-red-500 font-bold text-xl mb-1">
                {Number(product.price).toLocaleString()}₫
              </p>
              <p className="text-sm text-gray-500">
                {product.stockQuantity > 0
                  ? `Còn ${product.stockQuantity} sản phẩm`
                  : "Hết hàng"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
