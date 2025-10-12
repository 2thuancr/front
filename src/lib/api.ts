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
    const url = error.config?.url || '';
    const status = error.response?.status;
    
    // Skip logging for known problematic endpoints
    const skipLoggingEndpoints = [
      '/carts/user',
      '/wishlist',
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password'
    ];
    
    const shouldSkipLogging = skipLoggingEndpoints.some(endpoint => {
      if (endpoint.includes('.*')) {
        const regex = new RegExp(endpoint);
        return regex.test(url);
      }
      return url.includes(endpoint);
    });
    
    if (!shouldSkipLogging) {
      console.error('❌ API Error:', status, url, error.response?.data);
    } else {
      console.warn('⚠️ API Error (expected):', status, url);
    }
    
    // Handle 401 Unauthorized - but not for login/register endpoints
    if (status === 401) {
      // Don't handle unauthorized for auth endpoints (login, register, etc.)
      if (!url.includes('/auth/login') && !url.includes('/auth/register') && !url.includes('/auth/forgot-password')) {
        // Don't clear auth data for cart/wishlist endpoints that might not be implemented yet
        if (!url.includes('/carts/user') && !url.includes('/wishlist')) {
          console.log('🔒 401 Unauthorized on non-auth endpoint, clearing auth data');
          handleUnauthorized();
        } else {
          console.log('🔒 401 on cart/wishlist endpoint - likely not implemented yet');
        }
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
    api.put(`/orders/${orderId}/status`, { status }),
  
  updatePaymentStatus: (orderId: number, paymentStatus: string) =>
    api.patch(`/orders/${orderId}/payment-status`, { paymentStatus }),
  
  getOrderStats: () => api.get('/admin/orders/stats'),
};

// Vendor Order Management API
export const vendorOrderAPI = {
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
    api.put(`/orders/${orderId}/status`, { status }),
  
  getOrderStats: () => api.get('/orders/stats'),
};

// Staff Management API
export const staffAPI = {
  getAll: () => api.get('/staff'),
  getById: (id: number) => api.get(`/staff/${id}`),
  create: (data: any) => api.post('/staff', data),
  update: (id: number, data: any) => api.patch(`/staff/${id}`, data),
  delete: (id: number) => api.delete(`/staff/${id}`),
};

// Staff Order Management API
export const staffOrderAPI = {
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
    api.put(`/orders/${orderId}/status`, { status }),
  
  updatePaymentStatus: (orderId: number, paymentStatus: string) =>
    api.patch(`/orders/${orderId}/payment-status`, { paymentStatus }),
  
  getOrderStats: () => api.get('/orders/stats'),
};

// Staff Customer Management API
export const staffCustomerAPI = {
  getAllCustomers: () =>
    api.get('/users/getAll'),
  
  getCustomerById: (customerId: number) => 
    api.get(`/users/${customerId}`),
  
  // Note: Backend doesn't have update customer status endpoint yet
  // updateCustomerStatus: (customerId: number, isActive: boolean) =>
  //   api.patch(`/users/${customerId}/status`, { isActive }),
  
  getCustomerStats: () => api.get('/users/stats'),
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
      // Handle specific error cases gracefully
      if (error.response?.status === 401) {
        console.warn(`🔒 Unauthorized access to cart for user ${userId} - user may not be authenticated`);
      } else if (error.response?.status === 404) {
        console.warn(`📦 No cart found for user ${userId}`);
      } else if (error.response?.status === 400) {
        console.warn(`⚠️ Bad request for cart user ${userId}`);
      } else {
        console.error(`❌ getCartByUser API error:`, error);
      }
      
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

// Helper function to get consistent user ID
const getUserId = () => {
  // Try multiple sources in priority order
  const userIdFromStorage = localStorage.getItem('userId');
  const userFromStorage = localStorage.getItem('user');
  
  if (userIdFromStorage) {
    try {
      const parsed = JSON.parse(userIdFromStorage);
      
      // Auto-fix if user object exists and has different ID
      if (userFromStorage) {
        const parsedUser = JSON.parse(userFromStorage);
        if (parsedUser.id && parsedUser.id !== parsed) {
          localStorage.setItem('userId', JSON.stringify(parsedUser.id));
          return parsedUser.id;
        }
      }
      
      return parsed;
    } catch (error) {
      console.error('❌ Error parsing userId from localStorage:', error);
    }
  }
  
  if (userFromStorage) {
    try {
      const parsed = JSON.parse(userFromStorage);
      
      // Auto-sync userId if missing
      if (parsed.id && !userIdFromStorage) {
        localStorage.setItem('userId', JSON.stringify(parsed.id));
      }
      
      return parsed.id;
    } catch (error) {
      console.error('❌ Error parsing user from localStorage:', error);
    }
  }
  
  return null;
};

// WISHLIST API - Hybrid: localStorage + backend sync
export const wishlistApi = {
  // Get wishlist from backend (with localStorage fallback)
  getWishlist: async () => {
    try {
      // Get userId using consistent helper
      const userId = getUserId();
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Try backend first with user-specific endpoint
      const timestamp = Date.now();
      const response = await api.get(`/wishlist/user/${userId}?page=1&limit=100&t=${timestamp}`);
      
      // Backend returns { wishlists: [...], total: 1, page: "1", limit: "10" }
      return {
        wishlist: response.data.wishlists || [],
        total: response.data.total || 0,
        page: response.data.page || "1",
        limit: response.data.limit || "100"
      };
    } catch (error: any) {
      // Fallback to localStorage
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        return { wishlist };
      } catch (localError) {
        console.error('❌ Error getting wishlist from localStorage:', localError);
        return { wishlist: [] };
      }
    }
  },

  // Add product to wishlist (backend + localStorage)
  addToWishlist: async (productId: number) => {
    try {
      // Get userId using consistent helper
      const userId = getUserId();
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Try backend first with correct format
      const response = await api.post('/wishlist', { 
        productId: Number(productId), 
        userId: Number(userId) 
      });
      
      // Also save to localStorage for offline support
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const existingItem = wishlist.find((item: any) => item.productId === productId);
      
      if (!existingItem) {
        const newItem = {
          wishlistId: response.data.wishlistId || response.data.id || Date.now(),
          productId,
          userId: Number(userId),
          createdAt: new Date().toISOString()
        };
        wishlist.push(newItem);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      }
      
      return response.data;
    } catch (error: any) {
      console.warn('⚠️ Backend wishlist not available, using localStorage only:', error.message);
      
      // Fallback to localStorage only
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        
        // Check if product already exists
        const existingItem = wishlist.find((item: any) => item.productId === productId);
        if (existingItem) {
          return { 
            success: true, 
            message: 'Product already in wishlist',
            alreadyExists: true 
          };
        }

        // Add new item
        const userId = getUserId();
        const newItem = {
          wishlistId: Date.now(),
          productId,
          userId: userId ? Number(userId) : null,
          createdAt: new Date().toISOString()
        };
        
        wishlist.push(newItem);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        console.log('✅ Added to localStorage wishlist:', newItem);
        return { 
          success: true, 
          message: 'Added to wishlist',
          wishlistItem: newItem 
        };
      } catch (localError) {
        console.error('❌ Error adding to localStorage wishlist:', localError);
        return Promise.reject(localError);
      }
    }
  },

  // Remove product from wishlist (backend + localStorage)
  removeProductFromWishlist: async (productId: number) => {
    try {
      // Get userId using consistent helper
      const userId = getUserId();
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Try backend first - try different possible endpoints
      let response;
      try {
        // Try DELETE with productId and userId
        response = await api.delete(`/wishlist/product/${productId}`, {
          data: { userId: Number(userId) }
        });
      } catch (deleteError) {
        // Try alternative endpoint format
        response = await api.delete(`/wishlist`, {
          data: { productId: Number(productId), userId: Number(userId) }
        });
      }
      
      console.log('🗑️ Removed from backend wishlist:', response.data);
      
      // Also remove from localStorage
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const filteredWishlist = wishlist.filter((item: any) => item.productId !== productId);
      localStorage.setItem('wishlist', JSON.stringify(filteredWishlist));
      console.log('💾 Also removed from localStorage:', productId);
      
      return response.data;
    } catch (error: any) {
      console.warn('⚠️ Backend wishlist not available, using localStorage only:', error.message);
      
      // Fallback to localStorage only
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const filteredWishlist = wishlist.filter((item: any) => item.productId !== productId);
        
        localStorage.setItem('wishlist', JSON.stringify(filteredWishlist));
        
        console.log('🗑️ Removed from localStorage wishlist:', productId);
        return { success: true, message: 'Removed from wishlist' };
      } catch (localError) {
        console.error('❌ Error removing from localStorage wishlist:', localError);
        return Promise.reject(localError);
      }
    }
  },

  // Check if product is in wishlist (backend + localStorage)
  checkInWishlist: async (productId: number) => {
    try {
      // Get userId using consistent helper
      const userId = getUserId();
      
      if (!userId) {
        return { exists: false };
      }

      // Try backend first
      const response = await api.get(`/wishlist/check/${productId}?userId=${userId}`);
      console.log('🔍 Checked backend wishlist:', { productId, exists: response.data.exists });
      return response.data;
    } catch (error: any) {
      console.warn('⚠️ Backend wishlist not available, using localStorage only:', error.message);
      
      // Fallback to localStorage
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const exists = wishlist.some((item: any) => item.productId === productId);
        
        console.log('🔍 Checked localStorage wishlist:', { productId, exists });
        return { exists };
      } catch (localError) {
        console.error('❌ Error checking localStorage wishlist:', localError);
        return { exists: false };
      }
    }
  },

  // Get wishlist count (backend + localStorage)
  getWishlistCount: async (productId?: number) => {
    try {
      // Try backend first
      const endpoint = productId ? `/wishlist/count/${productId}` : '/wishlist/count';
      const response = await api.get(endpoint);
      console.log('📊 Backend wishlist count:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn('⚠️ Backend wishlist not available, using localStorage only');
      
      // Fallback to localStorage
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const count = productId 
          ? wishlist.filter((item: any) => item.productId === productId).length
          : wishlist.length;
        
        console.log('📊 LocalStorage wishlist count:', { productId, count });
        return { count };
      } catch (localError) {
        console.error('❌ Error getting localStorage wishlist count:', localError);
        return { count: 0 };
      }
    }
  },

  // Get user wishlist (backend + localStorage)
  getUserWishlist: async (userId: number) => {
    try {
      const response = await api.get(`/wishlist/user/${userId}`);
      console.log('👤 User wishlist from backend:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn('⚠️ Backend user wishlist not available, using localStorage');
      return wishlistApi.getWishlist();
    }
  },

  // Get product wishlist info (backend + localStorage)
  getProductWishlist: async (productId: number) => {
    try {
      const response = await api.get(`/wishlist/product/${productId}`);
      console.log('🛍️ Product wishlist from backend:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn('⚠️ Backend product wishlist not available, using localStorage');
      
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const productWishlist = wishlist.filter((item: any) => item.productId === productId);
        return { wishlist: productWishlist };
      } catch (localError) {
        console.error('❌ Error getting localStorage product wishlist:', localError);
        return { wishlist: [] };
      }
    }
  },

  // Get user wishlist count (backend + localStorage)
  getUserWishlistCount: async (userId: number) => {
    try {
      const response = await api.get(`/wishlist/user/${userId}/count`);
      console.log('👤 User wishlist count from backend:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn('⚠️ Backend user wishlist count not available, using localStorage');
      return wishlistApi.getWishlistCount();
    }
  },

  // Get most wishlisted products (backend + localStorage)
  getMostWishlisted: async (limit?: number) => {
    try {
      const response = await api.get(`/wishlist/most-wishlisted?limit=${limit || 10}`);
      console.log('⭐ Most wishlisted from backend:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn('⚠️ Backend most wishlisted not available');
      return { products: [] };
    }
  },

  // Remove by wishlist ID (backend + localStorage)
  removeFromWishlist: async (wishlistId: number) => {
    try {
      const response = await api.delete(`/wishlist/${wishlistId}`);
      console.log('🗑️ Removed wishlist item from backend:', response.data);
      
      // Also remove from localStorage
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const filteredWishlist = wishlist.filter((item: any) => item.wishlistId !== wishlistId);
      localStorage.setItem('wishlist', JSON.stringify(filteredWishlist));
      console.log('💾 Also removed from localStorage:', wishlistId);
      
      return response.data;
    } catch (error: any) {
      console.warn('⚠️ Backend wishlist not available, using localStorage only');
      
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const filteredWishlist = wishlist.filter((item: any) => item.wishlistId !== wishlistId);
        
        localStorage.setItem('wishlist', JSON.stringify(filteredWishlist));
        
        console.log('🗑️ Removed from localStorage wishlist:', wishlistId);
        return { success: true, message: 'Removed from wishlist' };
      } catch (localError) {
        console.error('❌ Error removing from localStorage wishlist:', localError);
        return Promise.reject(localError);
      }
    }
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

// Category API
export const categoryAPI = {
  getAll: (params?: any) => api.get("/categories", { params }),
  getById: (id: number) => api.get(`/categories/${id}`),
  create: (data: any) => api.post("/categories", data),
  update: (id: number, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

export default api;

