import { useState, useEffect } from 'react';
import { categoryAPI } from '@/lib/api';
import { Category } from '@/types/api';

interface UseCategoriesOptions {
  page?: number;
  limit?: number;
  search?: string;
}

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  refetch: () => Promise<void>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  handlePageChange: (page: number) => void;
}

export const useCategories = (options: UseCategoriesOptions = {}): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(options.page || 1);
  const [limit] = useState(options.limit || 10);
  const [search, setSearch] = useState(options.search || '');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await categoryAPI.getAll({
        page,
        limit,
        search: search || undefined
      });

      console.log('✅ Categories API response:', response.data);

      // Handle API response format
      let categoriesData: Category[] = [];
      let totalCount = 0;

      if (response.data.categories) {
        // API returns { categories: Category[], total: number, page: string, limit: string }
        categoriesData = response.data.categories;
        totalCount = response.data.total || categoriesData.length;
        console.log('📊 Categories pagination info:', {
          total: totalCount,
          page: response.data.page,
          limit: response.data.limit,
          categoriesCount: categoriesData.length
        });
      } else if (Array.isArray(response.data)) {
        // API returns Category[] directly
        categoriesData = response.data;
        totalCount = response.data.length;
      } else {
        console.warn('⚠️ Unexpected API response format:', response.data);
        categoriesData = [];
        totalCount = 0;
      }

      setCategories(categoriesData);
      setTotal(totalCount);

    } catch (err: any) {
      console.error('❌ Error fetching categories:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách danh mục');
      setCategories([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchCategories();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchCategories();
  }, [page, limit, search]);

  return {
    categories,
    loading,
    error,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    refetch,
    setPage,
    setSearch,
    handlePageChange,
  };
};
