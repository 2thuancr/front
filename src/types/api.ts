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
  isPrimary: boolean;
}

export interface Product {
  productId: number;
  categoryId: number;
  productName: string;
  description?: string;
  price: string; // API returns as string
  discountPercent?: string; // API returns as string
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
  images: ProductImage[];
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

