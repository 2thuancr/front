export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  description?: string;
  createdAt: string;
}

export interface ProductImage {
  imageId: number;
  productId: number;
  imageUrl: string;
  isPrimary: boolean | number; // Support both boolean and number (0/1)
}

export interface Product {
  productId: number;
  categoryId: number;
  vendorId?: number | null;
  productName: string;
  description?: string;
  price: string; // API returns as string
  discountPercent?: string; // API returns as string
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
  images: ProductImage[];
  reviews?: ProductReview[];
}

// Legacy interface for backward compatibility
export interface LegacyProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[];
  category: string; // Always string after transformation
  categoryId?: number;
  isNew?: boolean;
  isHot?: boolean;
  discount?: number;
  stock?: number;
  createdAt: string;
  updatedAt: string;
}

// Wishlist interfaces
export interface WishlistItem {
  wishlistId: number;
  userId: number;
  productId: number;
  createdAt: string;
  product?: Product;
}

export interface WishlistResponse {
  success: boolean;
  data: WishlistItem[];
  message?: string;
}

export interface WishlistCheckResponse {
  success: boolean;
  data: {
    isInWishlist: boolean;
    wishlistId?: number;
  };
  message?: string;
}

// Product Stats interfaces
export interface ProductStats {
  productId: number;
  totalViews: number;
  totalReviews: number;
  totalPurchases: number;
  totalWishlists: number;
  averageRating: number;
  product: Product;
}

export interface ProductStatsResponse {
  success: boolean;
  data: ProductStats;
  message?: string;
}

// Product View interfaces
export interface ProductView {
  viewId: number;
  userId: number;
  productId: number;
  viewedAt: string;
  product?: Product;
}

export interface ProductViewResponse {
  success: boolean;
  data: ProductView[];
  message?: string;
}

// Similar Products interface
export interface SimilarProductsResponse {
  success: boolean;
  data: Product[];
  message?: string;
}

// Product Review interfaces
export interface ProductReview {
  reviewId: number;
  productId: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
}

export interface ProductReviewResponse {
  success: boolean;
  data: ProductReview[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface RatingStats {
  productId: number;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface RatingStatsResponse {
  success: boolean;
  data: RatingStats;
  message?: string;
}

// Products list response interface
export interface ProductsResponse {
  products: Product[];
}

// Admin Product Stats interface
export interface AdminProductStats {
  total: number;
  active: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

// Category interfaces
export interface Category {
  categoryId: number;
  categoryName: string;
  description: string;
  productCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoriesResponse {
  categories: Category[];
  total: number;
  page: string;
  limit: string;
}

// Order interfaces
export interface OrderDetail {
  orderDetailId: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: string;
  product: Product;
}

export interface Order {
  orderId: number;
  userId: number;
  vendorId: number | null;
  orderDate: string;
  totalAmount: string;
  status: 'NEW' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: 'COD' | 'BANK_TRANSFER' | 'CREDIT_CARD';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: string | null;
  notes: string | null;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    gender: 'male' | 'female' | 'other' | null;
    dateOfBirth: string | null;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  orderDetails: OrderDetail[];
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

