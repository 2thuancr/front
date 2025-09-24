'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/api';
import { productAPI } from '@/lib/api';
import WishlistButton from './WishlistButton';
import { cn } from '@/lib/utils';

interface SimilarProductsProps {
  productId: number;
  limit?: number;
  className?: string;
  title?: string;
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({
  productId,
  limit = 6,
  className = '',
  title = 'Sản phẩm tương tự',
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First, get the current product to know its category
        const currentProductResponse = await productAPI.getProductById(productId);
        const currentProduct = currentProductResponse.data || currentProductResponse;
        
        if (!currentProduct || !currentProduct.categoryId) {
          setError('Unable to get product category');
          return;
        }
        
        // Get products from the same category
        const categoryProductsResponse = await productAPI.getByCategory(currentProduct.categoryId, limit + 1);
        let categoryProducts = categoryProductsResponse.data || categoryProductsResponse;
        
        // Handle different response formats
        if (categoryProducts.wishlists && Array.isArray(categoryProducts.wishlists)) {
          categoryProducts = categoryProducts.wishlists;
        } else if (categoryProducts.data && Array.isArray(categoryProducts.data)) {
          categoryProducts = categoryProducts.data;
        } else if (!Array.isArray(categoryProducts)) {
          categoryProducts = [];
        }
        
        // Filter out the current product and limit results
        const similarProducts = categoryProducts
          .filter((product: Product) => product.productId !== productId)
          .slice(0, limit);
        
        setProducts(similarProducts);
      } catch (err: any) {
        console.error('Error fetching similar products:', err);
        setError(err.message || 'Failed to load similar products');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchSimilarProducts();
    }
  }, [productId, limit]);

  const formatPrice = (price: string): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(Number(price));
  };

  const getProductImage = (product: Product): string => {
    const primaryImage = product.images?.find(img => img.isPrimary);
    const imageUrl = primaryImage?.imageUrl || product.images?.[0]?.imageUrl;
    
    // Fallback to placeholder if no image
    if (!imageUrl) {
      return '/images/placeholder.svg';
    }
    
    return imageUrl;
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <Link
            key={product.productId}
            href={`/products/${product.productId}`}
            className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="relative aspect-square overflow-hidden rounded-t-lg">
              <Image
                src={getProductImage(product)}
                alt={product.productName}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder.svg';
                }}
              />
              <div className="absolute top-2 right-2">
                <WishlistButton 
                  productId={product.productId} 
                  size="sm" 
                  variant="ghost"
                  className="bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>
            <div className="p-3">
              <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">
                {product.productName}
              </h4>
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-blue-600">
                  {formatPrice(product.price)}
                </div>
                {product.discountPercent && Number(product.discountPercent) > 0 && (
                  <div className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
                    -{product.discountPercent}%
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {product.category.categoryName}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
