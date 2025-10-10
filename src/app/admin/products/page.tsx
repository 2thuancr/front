'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Plus,
  Download,
  Star,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { adminProductAPI } from '@/lib/api';
import { Product, ProductsResponse } from '@/types/api';
import { useToastSuccess, useToastError } from '@/components/ui/Toast';

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(10);
  
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  // Fetch products from API with pagination
  const fetchProducts = async (page: number = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminProductAPI.getAllProducts(page, limit);
      
      if (response.data && response.data.products) {
        setProducts(response.data.products);
        setTotalProducts(response.data.total || response.data.products.length);
        
        // Calculate total pages
        const total = response.data.total || response.data.products.length;
        const calculatedTotalPages = Math.ceil(total / limit);
        setTotalPages(calculatedTotalPages);
        
      } else {
        console.warn('⚠️ No products data in response');
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(0);
      }
    } catch (error: any) {
      console.error('❌ Error fetching products:', error);
      setError(error.response?.data?.message || 'Không thể tải danh sách sản phẩm');
      toastError('Lỗi', 'Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products from API
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]); // Re-fetch when page changes

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const getDiscountPrice = (price: string, discountPercent: string) => {
    const originalPrice = parseFloat(price);
    const discount = parseFloat(discountPercent);
    return originalPrice / (1 - discount / 100);
  };

  const getAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Hết hàng', color: 'text-red-600' };
    if (stock < 10) return { text: 'Tồn kho thấp', color: 'text-yellow-600' };
    return { text: 'Còn hàng', color: 'text-green-600' };
  };

  const getPrimaryImage = (images: any[]) => {
    const primaryImage = images?.find(img => img.isPrimary === true || img.isPrimary === 1);
    return primaryImage?.imageUrl || images?.[0]?.imageUrl || '/images/placeholder.svg';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           product.category.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRefresh = async () => {
    await fetchProducts(currentPage);
    toastSuccess('Thành công', 'Đã làm mới danh sách sản phẩm');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleToggleActive = async (productId: number) => {
    try {
      await adminProductAPI.toggleProductActive(productId);
      
      // Update local state instead of calling API again
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.productId === productId 
            ? { ...product, isActive: !product.isActive }
            : product
        )
      );
      
      toastSuccess('Thành công', 'Đã cập nhật trạng thái sản phẩm');
    } catch (error: any) {
      console.error('❌ Error toggling product active:', error);
      toastError('Lỗi', 'Không thể cập nhật trạng thái sản phẩm');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Package className="w-8 h-8 text-gray-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
            <p className="text-gray-600 text-sm">Quản lý danh mục sản phẩm và tồn kho</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Có giảm giá</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => parseFloat(p.discountPercent) > 0).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tồn kho thấp</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.stockQuantity < 10 && p.stockQuantity > 0).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hết hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.stockQuantity === 0).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả danh mục</option>
              {Array.from(new Set(products.map(p => p.category.categoryName))).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Lọc</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span>Xuất file</span>
            </button>
          </div>
        </div>
      </div>


      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div>
            <p className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Đang tải danh sách sản phẩm...</span>
          </div>
        </div>
      )}

      {/* Products Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                    Đánh giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giảm giá
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Không tìm thấy sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const averageRating = getAverageRating(product.reviews);
                    const stockStatus = getStockStatus(product.stockQuantity);
                    const primaryImage = getPrimaryImage(product.images);
                    const discountPercent = parseFloat(product.discountPercent);
                    
                    return (
                      <tr key={product.productId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                              <img 
                                src={primaryImage} 
                                alt={product.productName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/images/placeholder.svg';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                              <div className="text-sm text-gray-500">ID: {product.productId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.category.categoryName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatPrice(product.price)}
                          </div>
                          {discountPercent > 0 && (
                            <div className="text-sm text-gray-500 line-through">
                              {formatPrice(getDiscountPrice(product.price, product.discountPercent).toString())}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${stockStatus.color}`}>
                            {product.stockQuantity} sản phẩm
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(averageRating) 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-1 text-sm text-gray-600">
                              {averageRating.toFixed(1)} ({product.reviews?.length || 0})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {discountPercent > 0 ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              -{discountPercent}%
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">Không có</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-gray-400 hover:text-gray-600" title="Xem chi tiết">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600" title="Chỉnh sửa">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600" title="Xóa">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination - Always show if there are products */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{' '}
                  <span className="font-medium">{(currentPage - 1) * limit + 1}</span>
                  {' '}đến{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * limit, totalProducts)}
                  </span>
                  {' '}trong tổng số{' '}
                  <span className="font-medium">{totalProducts}</span> sản phẩm
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {/* Page numbers */}
                  {totalPages > 1 && Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current page
                    const shouldShow = 
                      page === 1 || 
                      page === totalPages || 
                      Math.abs(page - currentPage) <= 1;
                    
                    if (!shouldShow) {
                      // Show ellipsis for gaps
                      if (page === 2 && currentPage > 4) {
                        return (
                          <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        );
                      }
                      if (page === totalPages - 1 && currentPage < totalPages - 3) {
                        return (
                          <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
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
