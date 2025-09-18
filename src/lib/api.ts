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
  
};

export const cartApi = {
  // CART
  createCart: (userId: number) =>
    api.post("/carts", { userId }).then((res) => res.data),

  getAllCarts: (page = 1, limit = 10) =>
    api.get(`/carts?page=${page}&limit=${limit}`).then((res) => res.data),

  getCartByUser: (userId: number) =>
    api.get(`/carts/user/${userId}`).then((res) => res.data),

  getCartDetail: (cartId: number) =>
    api.get(`/carts/${cartId}`).then((res) => res.data),

  getCartSummary: (cartId: number) =>
    api.get(`/carts/${cartId}/summary`).then((res) => res.data),

  updateCart: (cartId: number, data: any) =>
    api.put(`/carts/${cartId}`, data).then((res) => res.data),

  clearCart: (cartId: number) =>
    api.put(`/carts/${cartId}/clear`).then((res) => res.data),

  deleteCart: (cartId: number) =>
    api.delete(`/carts/${cartId}`).then((res) => res.data),

  // CART-ITEMS
  addToCart: (cartId: number, productId: number, quantity: number) =>
    api
      .post(`/cart-items`, { cartId, productId, quantity })
      .then((res) => res.data),

  getCartItems: (cartId: number) =>
    api.get(`/cart-items/cart/${cartId}`).then((res) => res.data),

  getCartItemDetail: (cartItemId: number) =>
    api.get(`/cart-items/${cartItemId}`).then((res) => res.data),

  updateCartItem: (cartItemId: number, data: any) =>
    api.put(`/cart-items/${cartItemId}`, data).then((res) => res.data),

  updateQuantity: (cartItemId: number, quantity: number) =>
    api
      .put(`/cart-items/${cartItemId}/quantity`, { quantity })
      .then((res) => res.data),

  removeFromCart: (cartItemId: number) =>
    api.delete(`/cart-items/${cartItemId}`).then((res) => res.data),

  removeByCartAndProduct: (cartId: number, productId: number) =>
    api
      .delete(`/cart-items/cart/${cartId}/product/${productId}`)
      .then((res) => res.data),

  clearCartItems: (cartId: number) =>
    api.delete(`/cart-items/cart/${cartId}/clear`).then((res) => res.data),
};

// ORDER API
export const orderApi = {
  // Orders
  createOrder: (data: any) =>
    api.post("/orders", data).then((res) => res.data),

  getOrdersByUser: (userId: number, page = 1, limit = 10) =>
    api.get(`/orders/user/${userId}?page=${page}&limit=${limit}`).then((res) => res.data),

  getOrderById: (orderId: number) =>
    api.get(`/orders/${orderId}`).then((res) => res.data),

  getOrderItems: (orderId: number) =>
    api.get(`/orders/${orderId}/items`).then((res) => res.data),

  updateOrderStatus: (orderId: number, data: any) =>
    api.put(`/orders/${orderId}/status`, data).then((res) => res.data),

  cancelOrder: (orderId: number) =>
    api.put(`/orders/${orderId}/cancel`).then((res) => res.data),

  // Order Payment
  processPayment: (orderId: number, data: any) =>
    api.post(`/orders/${orderId}/payment`, data).then((res) => res.data),

  getPaymentStatus: (orderId: number) =>
    api.get(`/orders/${orderId}/payment/status`).then((res) => res.data),
};

// PAYMENT API
export const paymentApi = {
  // Payment Methods
  getPaymentMethods: () =>
    api.get("/payment-methods").then((res) => res.data),

  getPaymentMethodById: (id: number) =>
    api.get(`/payment-methods/${id}`).then((res) => res.data),

  // Payments
  getPayments: (page = 1, limit = 10) =>
    api.get(`/payments?page=${page}&limit=${limit}`).then((res) => res.data),

  getPaymentById: (paymentId: number) =>
    api.get(`/payments/${paymentId}`).then((res) => res.data),

  getPaymentsByUser: (userId: number, page = 1, limit = 10) =>
    api.get(`/payments/user/${userId}?page=${page}&limit=${limit}`).then((res) => res.data),

  // Payment Statistics
  getPaymentStats: (period?: string) =>
    api.get(`/payments/stats${period ? `?period=${period}` : ''}`).then((res) => res.data),

  // Webhook
  handleWebhook: (gateway: string, data: any) =>
    api.post(`/payments/webhook/${gateway}`, data).then((res) => res.data),
};

export default api;

