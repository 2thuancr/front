'use client';

import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star, Eye, TrendingUp, Eye as EyeIcon, Percent, Clock } from 'lucide-react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { motion } from 'framer-motion';
import { productAPI } from '@/lib/api';
import { Product, LegacyProduct } from '@/types/api';
import Link from 'next/link';

type ProductType = 'latest' | 'bestseller' | 'most-viewed' | 'highest-discount';

const ProductGrid: React.FC = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [products, setProducts] = useState<LegacyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState<ProductType>('latest');
  const [productCount, setProductCount] = useState(8);

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

  const toggleWishlist = (productId: number) => {
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

  const ProductCard = ({ product }: { product: LegacyProduct }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
        <div className="relative">
          {/* Sửa: Bọc ảnh bằng Link */}
          <Link href={`/products/${product.id}`}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
          </Link>
          {/* Badges */}
          <div className="absolute top-2 left-2 space-y-2">
            {product.isNew && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Mới
              </span>
            )}
            {product.isHot && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Hot
              </span>
            )}
            {selectedType === 'highest-discount' && product.discount && product.discount >= 10 && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Siêu Sale
              </span>
            )}
          </div>
          {/* Discount Badge */}
          {product.discount && product.discount > 0 && (
            <div className="absolute top-2 right-2">
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                -{product.discount}%
              </span>
            </div>
          )}
          {/* Quick Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <Button
                icon={<Heart className="w-4 h-4" />}
                className="p-button-rounded p-button-text p-button-lg bg-white/90 hover:bg-white"
                tooltip="Yêu thích"
                onClick={() => toggleWishlist(product.id)}
              />
              {/* Sửa: Bọc Eye bằng Link */}
              <Link href={`/products/${product.id}`}>
                <Button
                  icon={<Eye className="w-4 h-4" />}
                  className="p-button-rounded p-button-text p-button-lg bg-white/90 hover:bg-white"
                  tooltip="Xem chi tiết"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex-1">
            <div className="mb-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {product.category}
              </span>
            </div>
            {/* Sửa: Bọc tên sản phẩm bằng Link */}
            <Link href={`/products/${product.id}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 cursor-pointer">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {selectedType === 'most-viewed' 
                  ? `(${product.reviewCount} lượt xem)`
                  : selectedType === 'highest-discount' && product.discount
                  ? `(Giảm ${product.discount}%)`
                  : `(${product.reviewCount})`
                }
              </span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Button docked to bottom */}
        <div className="p-4 pt-0">
          <Button
            label="Thêm vào giỏ"
            icon={<ShoppingCart className="w-4 h-4" />}
            className="w-full bg-blue-600 hover:bg-blue-700 border-0"
          />
        </div>
      </Card>
    </motion.div>
  );

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
            <ProductCard key={product.id} product={product} />
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