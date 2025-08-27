// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:5000',
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  ENDPOINTS: {
    AUTH: '/api/auth',
    USERS: '/api/users',
    PRODUCTS: '/api/products',
    ORDERS: '/api/orders',
  },
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'Gift Shop HCMUTE',
  DESCRIPTION: 'HCMUTE Gift Shop - Nơi lưu giữ những kỷ niệm đẹp của trường Đại học Sư phạm Kỹ thuật TP.HCM',
  VERSION: '1.0.0',
  AUTHOR: 'HCMUTE Team',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50] as number[],
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  API: 'yyyy-MM-dd',
  DATETIME: 'dd/MM/yyyy HH:mm',
} as const;

// Currency
export const CURRENCY = {
  CODE: 'VND',
  LOCALE: 'vi-VN',
  SYMBOL: '₫',
} as const;

// Product Categories
export const PRODUCT_CATEGORIES = [
  { label: 'Tất cả', value: '' },
  { label: 'Áo thun', value: 'Áo thun' },
  { label: 'Ba lô', value: 'Ba lô' },
  { label: 'Mũ nón', value: 'Mũ nón' },
  { label: 'Túi xách', value: 'Túi xách' },
] as Array<{ label: string; value: string }>;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  FORGOT_PASSWORD: '/forgot-password',
} as const;
