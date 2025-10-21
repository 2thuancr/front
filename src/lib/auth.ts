// Auth utility functions to avoid circular dependencies
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

// Helper function to clear wishlist from localStorage
export const clearWishlistFromStorage = () => {
  if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('persist:root')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.wishlist) {
            data.wishlist = {
              items: [],
              loading: false,
              error: null,
              checkedItems: {},
            };
            localStorage.setItem(key, JSON.stringify(data));
          }
        } catch (error) {
          console.error('Error clearing wishlist from storage:', error);
        }
      }
    });
  }
};

export const handleUnauthorized = () => {
  
  // Clear auth data
  clearAuthData();
  
  // Clear wishlist from localStorage
  clearWishlistFromStorage();
  
  // Redirect to login page only if not on public pages
  if (typeof window !== 'undefined') {
    const publicPaths = ['/', '/products', '/about', '/contact', '/login'];
    const isPublicPage = publicPaths.includes(window.location.pathname);
    
    if (!isPublicPage) {
      window.location.href = '/login';
    } else {
    }
  }
};

export const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }
  
  try {
    // Check if token has the correct JWT format (3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }
    
    // Decode JWT token payload to check expiration
    const base64Payload = parts[1];
    
    if (!base64Payload) {
      return false;
    }
    
    // Replace URL-safe characters if needed
    const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const base64WithPadding = base64 + padding;
    
    const payload = JSON.parse(atob(base64WithPadding));
    
    // Check if payload has expiration
    if (!payload.exp) {
      return false;
    }
    
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    // Clear invalid token
    localStorage.removeItem('token');
    return false;
  }
};
