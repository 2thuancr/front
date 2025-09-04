import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { handleUnauthorized } from './auth';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🚀 API Request:', config.method?.toUpperCase(), config.url, 'with token');
    } else {
      console.log('⚠️ API Request:', config.method?.toUpperCase(), config.url, 'without token');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ API Response:', response.status, response.config.url, response.data);
    return response;
  },
  async (error) => {
    console.error('❌ API Error:', error.response?.status, error.config?.url, error.response?.data);
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      handleUnauthorized();
    }

    return Promise.reject(error);
  }
);


// API endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    city: string;
    gender: 'male' | 'female' | 'other';
    dateOfBirth: string;
  }) => api.post('/auth/register', userData),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
    api.post('/auth/reset-password', data),
  
  verifyOTP: (data: { email: string; otp: string }) =>
    api.post('/auth/verify-otp', data),
  
  resendOTP: (email: string) =>
    api.post('/auth/resend-otp', { email }),
  
  refreshToken: () => api.post('/auth/refresh-token'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  
  updateProfile: (userId: number, data: any) =>
    api.post(`/users/update/${userId}`, data),
  
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => api.put('/users/change-password', data),
  
  uploadAvatar: (formData: FormData) =>
    api.post('/users/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export const productAPI = {
  getAll: (params?: any) => api.get("/products", { params }),
  getProductById: (id: number) => api.get(`/products/${id}`),
  getFeatured: (limit?: number) => api.get("/products/featured", { params: { limit } }),
  getLatest: (limit?: number) => api.get("/products/latest", { params: { limit } }),
  getBestSelling: (limit?: number) => api.get("/products/best-selling", { params: { limit } }),
  getMostViewed: (limit?: number) => api.get("/products/most-viewed", { params: { limit } }),
  getTopDiscount: (limit?: number) => api.get("/products/top-discount", { params: { limit } }),
  getHomepage: (params?: any) => api.get("/products/homepage", { params }),
  getByCategory: (categoryId: number, limit?: number) =>
    api.get(`/products/category/${categoryId}`, { params: { limit } }),
getLatestProducts: (limit: number = 8) =>
    api.get(`/products/latest?limit=${limit}`),
  
  getBestsellerProducts: (limit: number = 8) =>
    api.get(`/products/best-selling?limit=${limit}`),
  
  getMostViewedProducts: (limit: number = 8) =>
    api.get(`/products/most-viewed?limit=${limit}`),
  
  getHighestDiscountProducts: (limit: number = 8) =>
    api.get(`/products/top-discount?limit=${limit}`),
  
  getAllProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) => api.get('/products', { params }),
  
  getProductById: (id: number) =>
    api.get(`/products/${id}`),};

export default api;

