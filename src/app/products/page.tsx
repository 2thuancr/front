'use client';

import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Slider } from 'primereact/slider';
import { motion } from 'framer-motion';
import { Search, Filter, Heart, ShoppingCart, Star, Eye } from 'lucide-react';

// Mock data - sau này sẽ thay bằng API thật
const mockProducts = [
  {
    id: 1,
    name: 'Áo thun HCMUTE Classic',
    price: 250000,
    originalPrice: 300000,
    image: '/images/ao-thun-hcmute.jpg',
    category: 'Áo thun',
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isHot: false,
    discount: 17,
  },
  {
    id: 2,
    name: 'Ba lô HCMUTE Premium',
    price: 450000,
    originalPrice: 500000,
    image: '/images/ba-lo-hcmute.jpg',
    category: 'Ba lô',
    rating: 4.9,
    reviews: 89,
    isNew: false,
    isHot: true,
    discount: 10,
  },
  {
    id: 3,
    name: 'Mũ nón HCMUTE',
    price: 120000,
    originalPrice: 150000,
    image: '/images/hcmute-logo.png',
    category: 'Phụ kiện',
    rating: 4.6,
    reviews: 67,
    isNew: false,
    isHot: false,
    discount: 20,
  },
  {
    id: 4,
    name: 'Túi đeo chéo HCMUTE',
    price: 180000,
    originalPrice: 220000,
    image: '/images/hcmute-logo.png',
    category: 'Túi xách',
    rating: 4.7,
    reviews: 45,
    isNew: true,
    isHot: false,
    discount: 18,
  },
  {
    id: 5,
    name: 'Hoodie HCMUTE Winter',
    price: 380000,
    originalPrice: 450000,
    image: '/images/hcmute-logo.png',
    category: 'Áo khoác',
    rating: 4.9,
    reviews: 156,
    isNew: false,
    isHot: true,
    discount: 16,
  },
  {
    id: 6,
    name: 'Ví HCMUTE Leather',
    price: 280000,
    originalPrice: 350000,
    image: '/images/hcmute-logo.png',
    category: 'Phụ kiện',
    rating: 4.5,
    reviews: 78,
    isNew: false,
    isHot: false,
    discount: 20,
  },
];

const categories = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Áo thun', value: 'ao-thun' },
  { label: 'Áo khoác', value: 'ao-khoac' },
  { label: 'Ba lô', value: 'ba-lo' },
  { label: 'Túi xách', value: 'tui-xach' },
  { label: 'Phụ kiện', value: 'phu-kien' },
];

const sortOptions = [
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Giá tăng dần', value: 'price-asc' },
  { label: 'Giá giảm dần', value: 'price-desc' },
  { label: 'Đánh giá cao nhất', value: 'rating' },
  { label: 'Bán chạy nhất', value: 'popular' },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase().includes(selectedCategory.replace('-', ' '));
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (selectedSort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const ProductCard = ({ product }: { product: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
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
          </div>
          
          {/* Discount Badge */}
          {product.discount > 0 && (
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
              />
              <Button
                icon={<Eye className="w-4 h-4" />}
                className="p-button-rounded p-button-text p-button-lg bg-white/90 hover:bg-white"
                tooltip="Xem chi tiết"
              />
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h3>
          
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
              ({product.reviews})
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
          
          <Button
            label="Thêm vào giỏ"
            icon={<ShoppingCart className="w-4 h-4" />}
            className="w-full bg-blue-600 hover:bg-blue-700 border-0"
          />
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sản phẩm HCMUTE
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá bộ sưu tập độc đáo với thiết kế đặc trưng của trường Đại học Sư phạm Kỹ thuật TP.HCM
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <InputText
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm sản phẩm..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Danh mục</label>
              <Dropdown
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.value)}
                options={categories}
                className="w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Chọn danh mục"
              />
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sắp xếp</label>
              <Dropdown
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.value)}
                options={sortOptions}
                className="w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Sắp xếp theo"
              />
            </div>

            {/* View Mode */}
            <div className="flex space-x-2">
              <Button
                icon={<div className="grid grid-cols-2 gap-1 w-4 h-4"><div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div></div>}
                className={`p-3 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                onClick={() => setViewMode('grid')}
                tooltip="Xem dạng lưới"
              />
              <Button
                icon={<div className="w-4 h-4 space-y-1"><div className="bg-current rounded-sm h-1"></div><div className="bg-current rounded-sm h-1"></div><div className="bg-current rounded-sm h-1"></div></div>}
                className={`p-3 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                onClick={() => setViewMode('list')}
                tooltip="Xem dạng danh sách"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Khoảng giá: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </label>
            <Slider
              value={priceRange}
              onChange={(e) => setPriceRange(e.value as number[])}
              min={0}
              max={1000000}
              step={50000}
              className="w-full"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Tìm thấy <span className="font-semibold text-blue-600">{sortedProducts.length}</span> sản phẩm
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Filter className="w-4 h-4" />
            <span>Đã áp dụng bộ lọc</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-600 mb-6">
              Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
            <Button
              label="Xóa bộ lọc"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange([0, 1000000]);
              }}
              className="bg-blue-600 hover:bg-blue-700 border-0"
            />
          </div>
        )}
      </div>
    </div>
  );
}
