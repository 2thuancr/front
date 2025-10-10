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
  console.log('🔒 Unauthorized access - clearing auth data and redirecting');
  
  // Clear auth data
  clearAuthData();
  
  // Clear wishlist from localStorage
  clearWishlistFromStorage();
  
  // Redirect to login page only if not on public pages
  if (typeof window !== 'undefined') {
    const publicPaths = ['/', '/products', '/about', '/contact', '/login'];
    const isPublicPage = publicPaths.includes(window.location.pathname);
    
    if (!isPublicPage) {
      console.log('🔄 handleUnauthorized: Redirecting to login');
      window.location.href = '/login';
    } else {
      console.log('🔍 handleUnauthorized: On public page, not redirecting');
    }
  }
};

export const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }
  
  try {
    // Decode JWT token to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    console.error('❌ Invalid token format:', error);
    return false;
  }
};
