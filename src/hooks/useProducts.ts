'use client';

import { useState, useEffect } from 'react';
import { productAPI } from '@/lib/api';
import { Product, ProductsResponse } from '@/types/api';

interface UseProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  refetch: () => Promise<void>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  handlePageChange: (page: number) => void;
}

export const useProducts = (options: UseProductsOptions = {}): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(options.page || 1);
  const [limit] = useState(options.limit || 10); // Fixed limit, don't allow changes
  const [search, setSearch] = useState(options.search || '');
  const [category, setCategory] = useState(options.category || '');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching products with params:', {
        page,
        limit,
        category: category || undefined,
        search: search || undefined
      });

      const response = await productAPI.getAllProducts({
        page,
        limit,
        category: category || undefined,
        search: search || undefined
      });

      console.log('✅ Products API response:', response.data);

      // Handle different response formats
      let productsData: Product[] = [];
      let totalCount = 0;

      if (response.data.products) {
        // API returns { products: Product[], total: number, page: string, limit: string }
        productsData = response.data.products;
        totalCount = response.data.total || productsData.length;
        console.log('📊 Pagination info:', {
          total: totalCount,
          page: response.data.page,
          limit: response.data.limit,
          productsCount: productsData.length
        });
      } else if (Array.isArray(response.data)) {
        // API returns Product[] directly
        productsData = response.data;
        totalCount = response.data.length;
      } else {
        console.warn('⚠️ Unexpected API response format:', response.data);
        productsData = [];
        totalCount = 0;
      }

      setProducts(productsData);
      setTotal(totalCount);

    } catch (err: any) {
      console.error('❌ Error fetching products:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách sản phẩm');
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchProducts();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit, category, search]);

  return {
    products,
    loading,
    error,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    refetch,
    setPage,
    setSearch,
    setCategory,
    handlePageChange,
  };
};
