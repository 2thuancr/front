'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, User, Calendar } from 'lucide-react';
import { reviewApi } from '@/lib/api';
import { ProductReview, RatingStats } from '@/types/api';
import { useAuth } from '@/hooks/useAuth';
import StarRating from './StarRating';
import { cn } from '@/lib/utils';

interface ProductReviewsProps {
  productId: number;
  className?: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  className = '',
}) => {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Review form state
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchReviews();
    fetchRatingStats();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await reviewApi.getProductReviews(productId, 1, 10);
      // console.log('Reviews API response:', response);
      
      // Handle backend response format: { reviews, total, page, limit }
      let reviewsData = [];
      if (response.reviews && Array.isArray(response.reviews)) {
        reviewsData = response.reviews;
      } else if (response.data && Array.isArray(response.data)) {
        reviewsData = response.data;
      } else if (Array.isArray(response)) {
        reviewsData = response;
      }
      
      // console.log('Processed reviews:', reviewsData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      
      // Mock data for testing when API is not available
      const mockReviews = [
        {
          reviewId: 1,
          productId: productId,
          userId: 1,
          rating: 5,
          comment: 'Sản phẩm rất tốt, chất lượng cao và giá cả hợp lý. Tôi rất hài lòng với sản phẩm này!',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          user: {
            userId: 1,
            firstName: 'Nguyễn',
            lastName: 'Văn A',
            email: 'nguyenvana@example.com',
          }
        },
        {
          reviewId: 2,
          productId: productId,
          userId: 2,
          rating: 4,
          comment: 'Sản phẩm đẹp, giao hàng nhanh. Chỉ có một chút nhỏ về chất liệu nhưng tổng thể rất ổn.',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          user: {
            userId: 2,
            firstName: 'Trần',
            lastName: 'Thị B',
            email: 'tranthib@example.com',
          }
        },
        {
          reviewId: 3,
          productId: productId,
          userId: 3,
          rating: 5,
          comment: 'Tuyệt vời! Đúng như mô tả, chất lượng vượt mong đợi.',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString(),
          user: {
            userId: 3,
            firstName: 'Lê',
            lastName: 'Văn C',
            email: 'levanc@example.com',
          }
        }
      ];
      
      // console.log('Using mock reviews data');
      setReviews(mockReviews);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatingStats = async () => {
    try {
      const response = await reviewApi.getProductRatingStats(productId);
      // console.log('Rating stats API response:', response);
      
      // Handle different response structures
      let statsData = null;
      if (response.data) {
        statsData = response.data;
      } else if (response.averageRating !== undefined) {
        statsData = response;
      }
      
      // console.log('Processed rating stats:', statsData);
      setRatingStats(statsData);
    } catch (error) {
      console.error('Error fetching rating stats:', error);
      
      // Mock rating stats for testing when API is not available
      const mockRatingStats = {
        productId: productId,
        averageRating: 4.7,
        totalReviews: 3,
        ratingDistribution: {
          5: 2,
          4: 1,
          3: 0,
          2: 0,
          1: 0,
        }
      };
      
      // console.log('Using mock rating stats data');
      setRatingStats(mockRatingStats);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      alert('Vui lòng đăng nhập để đánh giá sản phẩm');
      return;
    }

    if (newRating === 0) {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }

    setSubmitting(true);
    try {
      const reviewData: any = {
        productId: Number(productId),
        userId: Number((user as any).id),
        rating: Number(newRating),
      };
      
      const trimmedComment = newComment.trim();
      if (trimmedComment) {
        reviewData.comment = trimmedComment;
      }

      // console.log('Submitting review with data:', reviewData);
      // console.log('User data:', user);

      const response = await reviewApi.createReview(reviewData);
      
      // console.log('Review submitted successfully:', response);
      
      // Refresh reviews and stats
      await fetchReviews();
      await fetchRatingStats();
      
      // Reset form
      setNewRating(0);
      setNewComment('');
      setShowReviewForm(false);
      
      alert('Đánh giá của bạn đã được gửi thành công!');
    } catch (error: any) {
      console.error('Error submitting review:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      
      // Show more specific error message
      let errorMessage = 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.';
      
      if (error.response?.status === 400) {
        const errorData = error.response?.data;
        if (errorData?.message?.includes('already reviewed')) {
          errorMessage = 'Bạn đã đánh giá sản phẩm này rồi. Bạn có thể chỉnh sửa đánh giá hiện tại.';
        } else if (errorData?.message) {
          errorMessage = `Lỗi: ${errorData.message}`;
        } else if (errorData?.errors) {
          // Handle validation errors
          const validationErrors = Object.values(errorData.errors).flat();
          errorMessage = `Lỗi validation: ${validationErrors.join(', ')}`;
        } else {
          errorMessage = 'Dữ liệu đánh giá không hợp lệ. Vui lòng kiểm tra lại.';
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Vui lòng đăng nhập để đánh giá sản phẩm.';
      } else if (error.response?.status === 404) {
        errorMessage = 'API đánh giá chưa được triển khai. Vui lòng thử lại sau.';
      }
      
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getUserName = (user: any): string => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email?.split('@')[0] || 'Người dùng';
  };

  const getUserInitials = (user: any): string => {
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

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If no reviews data available, show empty state
  if (!reviews || !Array.isArray(reviews)) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Đánh giá sản phẩm
          </h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Chưa có đánh giá nào cho sản phẩm này</p>
          <p className="text-sm">Hãy là người đầu tiên đánh giá sản phẩm!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Đánh giá sản phẩm
        </h3>
        {isAuthenticated && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showReviewForm ? 'Hủy' : 'Viết đánh giá'}
          </button>
        )}
      </div>

      {/* Rating Stats */}
      {ratingStats && ratingStats.averageRating !== undefined && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <StarRating rating={ratingStats.averageRating} size="lg" />
              <span className="ml-3 text-lg font-medium text-gray-900">
                {ratingStats.averageRating.toFixed(1)} trên 5
              </span>
            </div>
            <span className="text-gray-600">
              {ratingStats.totalReviews || 0} đánh giá
            </span>
          </div>
          
          {/* Rating Distribution */}
          {ratingStats.ratingDistribution && (
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingStats.ratingDistribution[star as keyof typeof ratingStats.ratingDistribution] || 0;
                const percentage = ratingStats.totalReviews > 0 ? (count / ratingStats.totalReviews) * 100 : 0;
                
                return (
                  <div key={star} className="flex items-center">
                    <span className="w-8 text-sm text-gray-600">{star}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current mx-2" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-sm text-gray-600 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h4 className="text-lg font-medium mb-4">Viết đánh giá của bạn</h4>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đánh giá của bạn *
              </label>
              <StarRating
                rating={newRating}
                interactive={true}
                onRatingChange={setNewRating}
                size="lg"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bình luận (tùy chọn)
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                maxLength={500}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {newComment.length}/500
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting || newRating === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {!reviews || !Array.isArray(reviews) || reviews.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đánh giá nào</h3>
            <p className="text-gray-600">Hãy là người đầu tiên đánh giá sản phẩm!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.reviewId} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              {/* Review Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start space-x-4">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    {review.user?.avatar ? (
                      <img
                        src={review.user.avatar}
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
                  <p className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
