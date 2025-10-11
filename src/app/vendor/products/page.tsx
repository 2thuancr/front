'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/api';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Star,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function VendorProductsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Use products hook to fetch real data with pagination
  const { 
    products, 
    loading, 
    error, 
    total, 
    page,
    limit,
    totalPages,
    refetch,
    setSearch,
    setCategory,
    handlePageChange
  } = useProducts({
    limit: 10, // Show 10 products per page
    search: searchTerm,
    category: selectedCategory === 'all' ? '' : selectedCategory
  });

  // Get unique categories from products
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category.categoryName)))];

  // Calculate stats from real data
  const activeProducts = products.filter(p => p.stockQuantity > 0);
  const outOfStockProducts = products.filter(p => p.stockQuantity === 0);
  const totalStock = products.reduce((sum, p) => sum + p.stockQuantity, 0);

  // Calculate average rating from reviews
  const getAverageRating = (product: Product) => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / product.reviews.length;
  };

  // Get primary image
  const getPrimaryImage = (product: Product) => {
    const primaryImage = product.images?.find(img => img.isPrimary);
    return primaryImage?.imageUrl || product.images?.[0]?.imageUrl || '/images/placeholder.svg';
  };

  const getStatusColor = (stockQuantity: number) => {
    if (stockQuantity > 10) return 'bg-green-100 text-green-800';
    if (stockQuantity > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = (stockQuantity: number) => {
    if (stockQuantity > 10) return 'Còn hàng';
    if (stockQuantity > 0) return 'Sắp hết';
    return 'Hết hàng';
  };

  // Handle search and category changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setSearch(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCategory(value === 'all' ? '' : value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Đang tải sản phẩm...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-gray-600 mt-1">
            Quản lý sản phẩm của cửa hàng ({total} sản phẩm)
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Thêm sản phẩm
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Còn hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeProducts.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hết hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {outOfStockProducts.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng tồn kho</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalStock}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Tất cả danh mục' : category}
                </option>
              ))}
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Danh sách sản phẩm ({products.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đã bán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => {
                const averageRating = getAverageRating(product);
                const reviewCount = product.reviews?.length || 0;
                const primaryImage = getPrimaryImage(product);
                
                return (
                  <tr key={product.productId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={primaryImage}
                            alt={product.productName}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.productName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: #{product.productId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category.categoryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {parseFloat(product.price).toLocaleString('vi-VN')}đ
                      {product.discountPercent && parseFloat(product.discountPercent) > 0 && (
                        <div className="text-xs text-red-600">
                          -{product.discountPercent}%
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stockQuantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {/* TODO: Add sold count from API */}
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.stockQuantity)}`}>
                        {getStatusText(product.stockQuantity)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="ml-1">{averageRating.toFixed(1)}</span>
                        <span className="ml-1 text-gray-500">({reviewCount})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{' '}
                  <span className="font-medium">{(page - 1) * limit + 1}</span>
                  {' '}đến{' '}
                  <span className="font-medium">
                    {Math.min(page * limit, total)}
                  </span>
                  {' '}trong tổng số{' '}
                  <span className="font-medium">{total}</span> sản phẩm
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    // Show first page, last page, current page, and pages around current page
                    const shouldShow = 
                      pageNum === 1 || 
                      pageNum === totalPages || 
                      Math.abs(pageNum - page) <= 1;
                    
                    if (!shouldShow) {
                      // Show ellipsis for gaps
                      if (pageNum === 2 && page > 4) {
                        return (
                          <span key={pageNum} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        );
                      }
                      if (pageNum === totalPages - 1 && page < totalPages - 3) {
                        return (
                          <span key={pageNum} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pageNum === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
