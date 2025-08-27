import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from './constants';
import { storage, handleAsyncError } from './utils';

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// API Error types
export class ApiError extends Error {
  public status: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// API Client class
class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = storage.get<string>('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = storage.get<string>('refresh_token');
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              const { accessToken } = response.data;
              
              storage.set('auth_token', accessToken);
              this.client.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
              
              // Retry failed requests
              this.failedQueue.forEach(({ resolve }) => resolve());
              this.failedQueue = [];
              
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Clear tokens and redirect to login
            storage.remove('auth_token');
            storage.remove('refresh_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  private async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request<ApiResponse<T>>(config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new ApiError(
          error.response.data?.message || 'Request failed',
          error.response.status,
          error.response.data?.code,
          error.response.data
        );
      } else if (error.request) {
        throw new ApiError('Network error', 0, 'NETWORK_ERROR');
      } else {
        throw new ApiError(error.message, 0, 'UNKNOWN_ERROR');
      }
    }
  }

  // HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // Auth methods
  async login(credentials: { email: string; password: string }) {
    return this.post<{ accessToken: string; refreshToken: string }>(
      API_CONFIG.ENDPOINTS.AUTH + '/login',
      credentials
    );
  }

  async register(userData: { email: string; password: string; name: string }) {
    return this.post<{ message: string }>(
      API_CONFIG.ENDPOINTS.AUTH + '/register',
      userData
    );
  }

  async refreshToken(refreshToken: string) {
    return this.post<{ accessToken: string }>(
      API_CONFIG.ENDPOINTS.AUTH + '/refresh',
      { refreshToken }
    );
  }

  async logout() {
    return this.post(API_CONFIG.ENDPOINTS.AUTH + '/logout');
  }

  // User methods
  async getProfile() {
    return this.get(API_CONFIG.ENDPOINTS.USERS + '/profile');
  }

  async updateProfile(userData: any) {
    return this.put(API_CONFIG.ENDPOINTS.USERS + '/profile', userData);
  }

  // Product methods
  async getProducts(params?: {
    page?: number;
    pageSize?: number;
    category?: string;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);

    const url = `${API_CONFIG.ENDPOINTS.PRODUCTS}?${searchParams.toString()}`;
    return this.get<PaginatedResponse<any>>(url);
  }

  async getProduct(id: string | number) {
    return this.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`);
  }

  // Order methods
  async createOrder(orderData: any) {
    return this.post(API_CONFIG.ENDPOINTS.ORDERS, orderData);
  }

  async getOrders(params?: { page?: number; pageSize?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());

    const url = `${API_CONFIG.ENDPOINTS.ORDERS}?${searchParams.toString()}`;
    return this.get<PaginatedResponse<any>>(url);
  }

  async getOrder(id: string | number) {
    return this.get(`${API_CONFIG.ENDPOINTS.ORDERS}/${id}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types
export type { ApiResponse, PaginatedResponse, ApiError };

// Export convenience methods
export const api = {
  get: apiClient.get.bind(apiClient),
  post: apiClient.post.bind(apiClient),
  put: apiClient.put.bind(apiClient),
  patch: apiClient.patch.bind(apiClient),
  delete: apiClient.delete.bind(apiClient),
  auth: {
    login: apiClient.login.bind(apiClient),
    register: apiClient.register.bind(apiClient),
    logout: apiClient.logout.bind(apiClient),
    refreshToken: apiClient.refreshToken.bind(apiClient),
  },
  users: {
    getProfile: apiClient.getProfile.bind(apiClient),
    updateProfile: apiClient.updateProfile.bind(apiClient),
  },
  products: {
    getAll: apiClient.getProducts.bind(apiClient),
    getById: apiClient.getProduct.bind(apiClient),
  },
  orders: {
    create: apiClient.createOrder.bind(apiClient),
    getAll: apiClient.getOrders.bind(apiClient),
    getById: apiClient.getOrder.bind(apiClient),
  },
};

