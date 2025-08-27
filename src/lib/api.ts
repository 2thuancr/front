import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '@/store';
import { logoutUser } from '@/store/authSlice';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear token and redirect to login
      store.dispatch(logoutUser());
      localStorage.removeItem('token');
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => api.post('/auth/register', userData),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (data: { token: string; password: string }) =>
    api.post('/auth/reset-password', data),
  
  refreshToken: () => api.post('/auth/refresh-token'),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  
  updateProfile: (data: any) =>
    api.put('/user/profile', data),
  
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => api.put('/user/change-password', data),
  
  uploadAvatar: (formData: FormData) =>
    api.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export default api;

