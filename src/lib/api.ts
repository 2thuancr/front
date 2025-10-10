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
    
    // Handle 401 Unauthorized - but not for login/register endpoints
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      
      // Don't handle unauthorized for auth endpoints (login, register, etc.)
      if (!url.includes('/auth/login') && !url.includes('/auth/register') && !url.includes('/auth/forgot-password')) {
        console.log('🔒 401 Unauthorized on non-auth endpoint, clearing auth data');
        handleUnauthorized();
      } else {
        console.log('🔒 401 on auth endpoint, not clearing auth data');
      }
    }
    return Promise.reject(error);
  }
);


// API endpoints
export const authAPI = {
  // Customer authentication
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

// Admin authentication
export const adminAuthAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/admin-auth/login', credentials),
  
  refreshToken: (refreshToken: string) =>
    api.post('/admin-auth/refresh', { refresh_token: refreshToken }),
  
  logout: () => api.post('/admin-auth/logout'),
};

// Vendor authentication
export const vendorAuthAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/vendor-auth/login', credentials),
  
  refreshToken: (refreshToken: string) =>
    api.post('/vendor-auth/refresh', { refresh_token: refreshToken }),
};

// Staff authentication
export const staffAuthAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/staff-auth/login', credentials),
  
  refreshToken: (refreshToken: string) =>
    api.post('/staff-auth/refresh', { refresh_token: refreshToken }),
  
  logout: () => api.post('/staff-auth/logout'),
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

  // Admin APIs
  getAllUsers: (params?: any) => api.get('/users/getAll', { params }),
  
  createUser: (data: any) => api.post('/users/create', data),
  
  updateUser: (userId: number, data: any) =>
    api.post(`/users/update/${userId}`, data),
  
  updateUserRole: (userId: number, role: string) =>
    api.post(`/users/update-role/${userId}`, { role }),
  
  toggleUserActive: (userId: number) =>
    api.post(`/users/toggle-active/${userId}`),
  
  getUsersStats: () => api.get('/users/stats'),
};

// Admin Customer Management API
export const adminCustomerAPI = {
  getAllCustomers: () => api.get('/admin/customers'),
  
  getCustomerById: (customerId: number) => 
    api.get(`/admin/customers/${customerId}`),
  
  updateCustomer: (customerId: number, data: any) =>
    api.put(`/admin/customers/${customerId}`, data),
  
  toggleCustomerActive: (customerId: number) =>
    api.patch(`/admin/customers/${customerId}/toggle-active`),
  
  deleteCustomer: (customerId: number) =>
    api.delete(`/admin/customers/${customerId}`),
  
  getCustomerStats: () => api.get('/admin/customers/stats'),
};

// Admin Product Management API
export const adminProductAPI = {
  getAllProducts: (page: number = 1, limit: number = 10) => api.get('/products', { 
    params: { 
      page,
      limit
    } 
  }),
  
  getProductById: (productId: number) => 
    api.get(`/products/${productId}`),
  
  createProduct: (data: FormData) =>
    api.post('/products', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  updateProduct: (productId: number, data: any) =>
    api.put(`/products/${productId}`, data),
  
  deleteProduct: (productId: number) =>
    api.delete(`/products/${productId}`),
  
  toggleProductActive: (productId: number) =>
    api.patch(`/products/${productId}/toggle-active`),
  
  updateProductStock: (productId: number, stock: number) =>
    api.patch(`/products/${productId}/stock`, { stock }),
  
  getProductStats: () => api.get('/admin/products/stats'),
};

// Admin Category Management API
export const adminCategoryAPI = {
  getAllCategories: (page: number = 1, limit: number = 10) => api.get('/categories', { 
    params: { 
      page,
      limit
    } 
  }),
  
  getCategoryById: (categoryId: number) => 
    api.get(`/categories/${categoryId}`),
  
  createCategory: (data: any) =>
    api.post('/categories', data),
  
  updateCategory: (categoryId: number, data: any) =>
    api.put(`/categories/${categoryId}`, data),
  
  deleteCategory: (categoryId: number) =>
    api.delete(`/categories/${categoryId}`),
  
  getCategoryStats: () => api.get('/admin/categories/stats'),
};

// Admin Order Management API
export const adminOrderAPI = {
  getAllOrders: (page: number = 1, limit: number = 10) => 
    api.get('/orders', { 
      params: { 
        page,
        limit
      } 
    }),
  
  getOrderById: (orderId: number) => 
    api.get(`/orders/${orderId}`),
  
  updateOrderStatus: (orderId: number, status: string) =>
    api.patch(`/orders/${orderId}/status`, { status }),
  
  updatePaymentStatus: (orderId: number, paymentStatus: string) =>
    api.patch(`/orders/${orderId}/payment-status`, { paymentStatus }),
  
  getOrderStats: () => api.get('/admin/orders/stats'),
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

// Track failed cart endpoints
const failedCartEndpoints = new Set<string>();

// Utility function to reset failed endpoints
export const resetFailedCartEndpoints = () => {
  failedCartEndpoints.clear();
  console.log('🔄 Failed cart endpoints reset');
};

// Utility function to check if cart endpoints are available
export const isCartEndpointAvailable = (endpoint: 'carts' | 'carts/user') => {
  return !failedCartEndpoints.has(endpoint);
};

// Utility function to reset cart endpoints (useful for testing or when backend is fixed)
export const resetCartEndpoints = () => {
  failedCartEndpoints.clear();
  console.log('🔄 Cart endpoints reset - will try API calls again');
};

export const cartApi = {
  // CART
  createCart: (userId: number) => {
    if (!userId || userId <= 0) {
      console.warn(`⚠️ Invalid userId for createCart: ${userId}`);
      return Promise.reject(new Error(`Invalid userId: ${userId}`));
    }
    
    // Check if endpoint has failed before
    if (failedCartEndpoints.has('carts')) {
      console.log(`📊 Cart creation skipped - endpoint known to fail`);
      return Promise.reject(new Error('Cart endpoint not available'));
    }
    
    console.log(`📡 Calling createCart API for userId: ${userId}`);
    return api.post("/carts", { userId }).then((res) => {
      console.log(`✅ createCart API response:`, res.data);
      return res.data;
    }).catch((error) => {
      console.error(`❌ createCart API error:`, error);
      
      // Mark endpoint as failed for specific error codes
      if (error.response?.status === 400 || error.response?.status === 404) {
        failedCartEndpoints.add('carts');
        console.warn(`⚠️ Cart endpoint marked as failed due to ${error.response.status} error`);
      }
      
      throw error;
    });
  },

  getAllCarts: (page = 1, limit = 10) =>
    api.get(`/carts?page=${page}&limit=${limit}`).then((res) => res.data),

  getCartByUser: (userId: number) => {
    if (!userId || userId <= 0) {
      console.warn(`⚠️ Invalid userId for getCartByUser: ${userId}`);
      return Promise.reject(new Error(`Invalid userId: ${userId}`));
    }
    
    // Check if endpoint has failed before
    if (failedCartEndpoints.has('carts/user')) {
      console.log(`📊 Cart fetch skipped - endpoint known to fail`);
      return Promise.reject(new Error('Cart endpoint not available'));
    }
    
    console.log(`📡 Calling getCartByUser API for userId: ${userId}`);
    return api.get(`/carts/user/${userId}`).then((res) => {
      console.log(`✅ getCartByUser API response:`, res.data);
      return res.data;
    }).catch((error) => {
      console.error(`❌ getCartByUser API error:`, error);
      
      // Mark endpoint as failed for specific error codes
      if (error.response?.status === 400 || error.response?.status === 404) {
        failedCartEndpoints.add('carts/user');
        console.warn(`⚠️ Cart user endpoint marked as failed due to ${error.response.status} error`);
      }
      
      throw error;
    });
  },

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

// WISHLIST API
export const wishlistApi = {
  // Wishlist Management - Temporarily disabled until backend API is ready
  addToWishlist: (productId: number) => {
    console.warn('⚠️ Wishlist API not implemented yet');
    return Promise.resolve({ success: true, message: 'Wishlist feature coming soon' });
  },

  getWishlist: () => {
    console.warn('⚠️ Wishlist API not implemented yet');
    return Promise.resolve({ wishlist: [] });
  },

  getUserWishlist: (userId: number) => {
    console.warn('⚠️ Wishlist API not implemented yet');
    return Promise.resolve({ wishlist: [] });
  },

  getProductWishlist: (productId: number) => {
    console.warn('⚠️ Wishlist API not implemented yet');
    return Promise.resolve({ wishlist: [] });
  },

  getWishlistCount: (productId: number) => {
    console.warn('⚠️ Wishlist API not implemented yet');
    return Promise.resolve({ count: 0 });
  },

  getUserWishlistCount: (userId: number) => {
    console.warn('⚠️ Wishlist API not implemented yet');
    return Promise.resolve({ count: 0 });
  },

  getMostWishlisted: (limit?: number) => {
    console.warn('⚠️ Wishlist API not implemented yet');
    return Promise.resolve({ products: [] });
  },

  checkInWishlist: (productId: number) => {
    console.warn('⚠️ Wishlist API not implemented yet');
    return Promise.resolve({ exists: false });
  },

  removeFromWishlist: (wishlistId: number) => {
    console.warn('⚠️ Wishlist API not implemented yet');
    return Promise.resolve({ success: true });
  },

  removeProductFromWishlist: (productId: number) => {
    console.warn('⚠️ Wishlist API not implemented yet');
    return Promise.resolve({ success: true });
  },
};

// PRODUCT STATS API
export const productStatsApi = {
  getProductStats: (productId: number) =>
    api.get(`/products/${productId}/stats`).then((res) => res.data),

  getSimilarProducts: (productId: number, limit: number = 6) =>
    api.get(`/products/${productId}/similar`, { params: { limit } }).then((res) => res.data),

  getMostViewed: (limit?: number) =>
    api.get('/products/most-viewed', { params: { limit } }).then((res) => res.data),

  getProductViewCount: (productId: number) =>
    api.get(`/product-views/product/${productId}/count`).then((res) => res.data),

  getUserViewHistory: (userId: number, page: number = 1, limit: number = 10) =>
    api.get(`/product-views/user/${userId}`, { 
      params: { page, limit } 
    }).then((res) => res.data),

  trackProductView: (productId: number) =>
    api.post(`/product-views/track/${productId}`).then((res) => res.data),
};

// PRODUCT REVIEWS API
export const reviewApi = {
  // Get reviews for a product
  getProductReviews: (productId: number, page: number = 1, limit: number = 10) =>
    api.get(`/product-reviews/product/${productId}`, { 
      params: { page, limit } 
    }).then((res) => res.data),

  // Get rating stats for a product
  getProductRatingStats: (productId: number) =>
    api.get(`/product-reviews/product/${productId}/rating-stats`).then((res) => res.data),

  // Create a new review
  createReview: (data: {
    productId: number;
    userId: number;
    rating: number;
    comment?: string;
  }) => api.post('/product-reviews', data).then((res) => res.data),

  // Update a review
  updateReview: (reviewId: number, data: {
    rating?: number;
    comment?: string;
  }) => api.put(`/product-reviews/${reviewId}`, data).then((res) => res.data),

  // Delete a review
  deleteReview: (reviewId: number) =>
    api.delete(`/product-reviews/${reviewId}`).then((res) => res.data),

  // Get user's reviews
  getUserReviews: (userId: number, page: number = 1, limit: number = 10) =>
    api.get(`/product-reviews`, { 
      params: { userId, page, limit } 
    }).then((res) => res.data),

  // Get user's review for a specific product
  getUserReviewForProduct: (userId: number, productId: number) =>
    api.get(`/product-reviews/user/${userId}/product/${productId}`).then((res) => res.data),
};


export default api;

