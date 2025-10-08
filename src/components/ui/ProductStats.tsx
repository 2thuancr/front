'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Eye, Star, ShoppingBag, Heart, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { productStatsApi, wishlistApi } from '@/lib/api';
import { ProductStats } from '@/types/api';

interface ProductStatsProps {
  productId: number;
  className?: string;
  showIcons?: boolean;
  compact?: boolean;
}

const ProductStatsComponent: React.FC<ProductStatsProps> = ({
  productId,
  className = '',
  showIcons = true,
  compact = false,
}) => {
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const lastCheckedStatus = useRef<boolean | undefined>(undefined);
  
  // Get wishlist state to track changes
  const { checkedItems } = useSelector((state: RootState) => state.wishlist);
  const isInWishlist = checkedItems[productId];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both product stats and wishlist count
        const [statsResponse, wishlistResponse] = await Promise.all([
          productStatsApi.getProductStats(productId),
          wishlistApi.getProductWishlist(productId)
        ]);
        
        const statsData = statsResponse.data || statsResponse;
        const wishlistData = wishlistResponse.data || wishlistResponse;
        
        setStats(statsData);
        setWishlistCount(wishlistData.total || 0);
      } catch (err: any) {
        setError(err.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchStats();
    }
  }, [productId]);

  // Refresh wishlist count only when THIS product's wishlist status actually changes
  useEffect(() => {
    if (isInWishlist !== undefined && isInWishlist !== lastCheckedStatus.current) {
      lastCheckedStatus.current = isInWishlist;
      
      const refreshWishlistCount = async () => {
        try {
          const response = await wishlistApi.getProductWishlist(productId);
          const wishlistData = response.data || response;
          setWishlistCount(wishlistData.total || 0);
        } catch (err) {
          // Error handled
        }
      };
      
      // Add a small delay to ensure database is updated
      const timer = setTimeout(refreshWishlistCount, 500);
      return () => clearTimeout(timer);
    }
  }, [isInWishlist, productId]);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="flex space-x-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="w-8 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const statsItems = [
    {
      icon: Eye,
      value: stats.totalViews,
      label: 'Lượt xem',
      color: 'text-blue-600',
      isRating: false,
    },
    {
      icon: Star,
      value: Number(stats.averageRating).toFixed(1),
      label: 'Đánh giá',
      color: 'text-yellow-600',
      isRating: true,
    },
    {
      icon: ShoppingBag,
      value: stats.totalPurchases,
      label: 'Đã bán',
      color: 'text-green-600',
      isRating: false,
    },
    {
      icon: Heart,
      value: wishlistCount,
      label: 'Yêu thích',
      color: 'text-red-600',
      isRating: false,
    },
    {
      icon: Users,
      value: stats.totalReviews,
      label: 'Bình luận',
      color: 'text-purple-600',
      isRating: false,
    },
  ];

  if (compact) {
    return (
      <div className={`flex items-center space-x-4 text-sm ${className}`}>
        {statsItems.map((item, index) => {
          const Icon = item.icon;
          const displayValue = item.isRating ? item.value : formatNumber(Number(item.value));
          return (
            <div key={index} className="flex items-center space-x-1">
              {showIcons && <Icon className={`w-4 h-4 ${item.color}`} />}
              <span className="font-medium">{displayValue}</span>
              <span className="text-gray-500">{item.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-5 gap-4 ${className}`}>
      {statsItems.map((item, index) => {
        const Icon = item.icon;
        const displayValue = item.isRating ? item.value : formatNumber(Number(item.value));
        return (
          <div key={index} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            {showIcons && <Icon className={`w-6 h-6 ${item.color} mb-2`} />}
            <div className="text-lg font-bold text-gray-900">
              {displayValue}
            </div>
            <div className="text-sm text-gray-600 text-center">
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductStatsComponent;
