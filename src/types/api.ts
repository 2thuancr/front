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

