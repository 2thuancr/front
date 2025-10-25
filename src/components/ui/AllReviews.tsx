'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, User, Calendar, Package, Eye } from 'lucide-react';
import { reviewApi } from '@/lib/api';
import { ProductReview } from '@/types/api';
import StarRating from '@/components/ui/StarRating';
import { motion } from 'framer-motion';

interface AllReviewsProps {
  className?: string;
}

const AllReviews: React.FC<AllReviewsProps> = ({ className = '' }) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewApi.getAllReviews(page, 10);
      
      // Handle response format: { reviews, total, page, limit }
      const reviewsData = response.reviews || [];
      const totalCount = response.total || 0;
      
      if (page === 1) {
        setReviews(reviewsData);
      } else {
        setReviews(prev => [...prev, ...reviewsData]);
      }
      
      setTotal(totalCount);
      setHasMore(reviewsData.length === 10);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserName = (user: any) => {
    if (!user) return 'Người dùng ẩn danh';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Người dùng';
  };

  const getUserInitials = (user: any) => {
    if (!user) return '?';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) return firstName.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return '?';
  };

  const getUserAvatar = (user: any) => {
    if (!user) return null;
    return user.avatar || null;
  };

  if (loading && reviews.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Đang tải đánh giá...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Đánh giá sản phẩm</h2>
            <p className="text-gray-600">{total} đánh giá từ khách hàng</p>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, index) => (
          <motion.div
            key={review.reviewId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
          >
            {/* Review Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start space-x-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  {getUserAvatar(review.user) ? (
                    <img
                      src={getUserAvatar(review.user)}
                      alt={getUserName(review.user)}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {getUserInitials(review.user)}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {getUserName(review.user)}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-sm text-gray-500">
                      {review.rating}/5
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="p-6">
              {review.comment && (
                <p className="text-gray-700 leading-relaxed mb-4">
                  {review.comment}
                </p>
              )}

              {/* Product Info */}
              {review.product && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Sản phẩm đã đánh giá</span>
                  </div>
                  <h5 className="font-medium text-gray-900 truncate">
                    {review.product.productName}
                  </h5>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">
                      ID: {review.product.productId}
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      {parseFloat(review.product.price).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang tải...</span>
              </div>
            ) : (
              'Xem thêm đánh giá'
            )}
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && reviews.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đánh giá nào</h3>
          <p className="text-gray-600">Hãy là người đầu tiên đánh giá sản phẩm!</p>
        </div>
      )}
    </div>
  );
};

export default AllReviews;
