import { useState, useEffect } from 'react';
import { useProducts } from './useProducts';
import { vendorOrderAPI } from '@/lib/api';

interface VendorStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  averageRating: number;
  pendingOrders: number;
  loading: boolean;
  error: string | null;
}

export const useVendorStats = (): VendorStats => {
  const [stats, setStats] = useState<VendorStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    averageRating: 0,
    pendingOrders: 0,
    loading: true,
    error: null,
  });

  const { products, loading: productsLoading } = useProducts({ limit: 1000 }); // Get all products

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        // Fetch orders data
        const ordersResponse = await vendorOrderAPI.getAllOrders(1, 1000); // Get all orders
        const orders = ordersResponse.data?.orders || [];

        // Calculate stats
        const totalProducts = products.length;
        const totalOrders = orders.length;
        
        // Calculate total revenue from completed orders
        const totalRevenue = orders
          .filter((order: any) => order.status === 'delivered' || order.status === 'completed')
          .reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);

        // Calculate unique customers
        const uniqueCustomers = new Set(orders.map((order: any) => order.userId)).size;

        // Calculate average rating from products
        const productsWithReviews = products.filter(product => product.reviews && product.reviews.length > 0);
        const averageRating = productsWithReviews.length > 0 
          ? productsWithReviews.reduce((sum, product) => {
              const productRating = product.reviews?.reduce((reviewSum, review) => reviewSum + review.rating, 0) || 0;
              return sum + (productRating / (product.reviews?.length || 1));
            }, 0) / productsWithReviews.length
          : 0;

        // Count pending orders
        const pendingOrders = orders.filter((order: any) => 
          order.status === 'pending' || order.status === 'processing'
        ).length;

        setStats({
          totalProducts,
          totalOrders,
          totalRevenue,
          totalCustomers: uniqueCustomers,
          averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
          pendingOrders,
          loading: false,
          error: null,
        });

      } catch (error: any) {
        console.error('❌ Error fetching vendor stats:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error.response?.data?.message || 'Không thể tải thống kê',
        }));
      }
    };

    if (!productsLoading) {
      fetchStats();
    }
  }, [products, productsLoading]);

  return stats;
};
