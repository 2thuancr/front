'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  Star, 
  Search, 
  Filter, 
  ThumbsUp, 
  ThumbsDown, 
  Reply,
  Flag,
  MoreHorizontal
} from 'lucide-react';

export default function VendorReviewsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState('all');

  // Mock data - replace with real API calls
  const reviews = [
    {
      id: 1,
      customer: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      product: 'iPhone 15 Pro Max',
      productImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      rating: 5,
      comment: 'Sản phẩm rất tốt, đúng như mô tả. Giao hàng nhanh, đóng gói cẩn thận. Sẽ mua lại lần sau!',
      date: '2024-01-15T10:30:00Z',
      helpful: 12,
      notHelpful: 2,
      status: 'published',
      reply: null
    },
    {
      id: 2,
      customer: 'Trần Thị B',
      email: 'tranthib@email.com',
      product: 'Samsung Galaxy S24 Ultra',
      productImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
      rating: 4,
      comment: 'Sản phẩm chất lượng tốt, giá cả hợp lý. Tuy nhiên thời gian giao hàng hơi lâu.',
      date: '2024-01-14T14:20:00Z',
      helpful: 8,
      notHelpful: 1,
      status: 'published',
      reply: {
        text: 'Cảm ơn bạn đã đánh giá. Chúng tôi sẽ cải thiện dịch vụ giao hàng để phục vụ tốt hơn.',
        date: '2024-01-14T16:30:00Z'
      }
    },
    {
      id: 3,
      customer: 'Lê Văn C',
      email: 'levanc@email.com',
      product: 'MacBook Pro M3',
      productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      rating: 5,
      comment: 'Tuyệt vời! Sản phẩm đúng như mong đợi. Dịch vụ khách hàng tốt, tư vấn nhiệt tình.',
      date: '2024-01-13T09:15:00Z',
      helpful: 15,
      notHelpful: 0,
      status: 'published',
      reply: null
    },
    {
      id: 4,
      customer: 'Phạm Thị D',
      email: 'phamthid@email.com',
      product: 'AirPods Pro 2',
      productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      rating: 2,
      comment: 'Sản phẩm có vấn đề về chất lượng. Âm thanh không rõ, pin nhanh hết. Không hài lòng.',
      date: '2024-01-12T16:45:00Z',
      helpful: 3,
      notHelpful: 8,
      status: 'published',
      reply: {
        text: 'Xin lỗi về trải nghiệm không tốt. Chúng tôi sẽ liên hệ để hỗ trợ đổi trả sản phẩm.',
        date: '2024-01-12T18:00:00Z'
      }
    },
    {
      id: 5,
      customer: 'Hoàng Văn E',
      email: 'hoangvane@email.com',
      product: 'iPad Air 5',
      productImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500',
      rating: 4,
      comment: 'Sản phẩm tốt, giá cả hợp lý. Giao hàng đúng hẹn. Sẽ giới thiệu cho bạn bè.',
      date: '2024-01-11T11:30:00Z',
      helpful: 6,
      notHelpful: 1,
      status: 'published',
      reply: null
    }
  ];

  const ratings = ['all', '5', '4', '3', '2', '1'];

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = selectedRating === 'all' || review.rating.toString() === selectedRating;
    return matchesSearch && matchesRating;
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 5: return 'Tuyệt vời';
      case 4: return 'Tốt';
      case 3: return 'Bình thường';
      case 2: return 'Không tốt';
      case 1: return 'Rất tệ';
      default: return 'Không xác định';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Đánh giá khách hàng</h1>
          <p className="text-gray-600 mt-1">
            Xem và quản lý đánh giá từ khách hàng
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Tổng đánh giá:</span>
          <span className="text-lg font-semibold text-gray-900">{reviews.length}</span>
        </div>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Rating */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <p className="text-sm text-gray-600">
              Dựa trên {reviews.length} đánh giá
            </p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố đánh giá</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center">
                <span className="text-sm font-medium text-gray-600 w-8">{rating}</span>
                <div className="flex items-center mx-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 mx-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ 
                        width: `${ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-8 text-right">
                  {ratingDistribution[rating as keyof typeof ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê nhanh</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Đánh giá tích cực</span>
              <span className="text-sm font-semibold text-green-600">
                {reviews.filter(r => r.rating >= 4).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Đánh giá tiêu cực</span>
              <span className="text-sm font-semibold text-red-600">
                {reviews.filter(r => r.rating <= 2).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Đã trả lời</span>
              <span className="text-sm font-semibold text-blue-600">
                {reviews.filter(r => r.reply).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Chưa trả lời</span>
              <span className="text-sm font-semibold text-gray-600">
                {reviews.filter(r => !r.reply).length}
              </span>
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
                placeholder="Tìm kiếm đánh giá..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ratings.map(rating => (
                <option key={rating} value={rating}>
                  {rating === 'all' ? 'Tất cả đánh giá' : `${rating} sao`}
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

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Danh sách đánh giá ({filteredReviews.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredReviews.map((review) => (
            <div key={review.id} className="p-6">
              <div className="flex items-start space-x-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    className="w-16 h-16 rounded-lg object-cover"
                    src={review.productImage}
                    alt={review.product}
                  />
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {review.customer}
                      </h4>
                      <p className="text-sm text-gray-500">{review.product}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                      <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>
                        {getRatingText(review.rating)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-700">{review.comment}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-500">
                        {new Date(review.date).toLocaleDateString('vi-VN')}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center text-xs text-gray-500 hover:text-green-600">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {review.helpful}
                        </button>
                        <button className="flex items-center text-xs text-gray-500 hover:text-red-600">
                          <ThumbsDown className="w-3 h-3 mr-1" />
                          {review.notHelpful}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!review.reply && (
                        <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                          <Reply className="w-4 h-4 mr-1" />
                          Trả lời
                        </button>
                      )}
                      <button className="text-gray-500 hover:text-gray-700 text-sm flex items-center">
                        <Flag className="w-4 h-4 mr-1" />
                        Báo cáo
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Reply */}
                  {review.reply && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-blue-600">SH</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-blue-900">Cửa hàng</span>
                            <span className="text-xs text-blue-600">
                              {new Date(review.reply.date).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <p className="text-sm text-blue-800 mt-1">{review.reply.text}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
