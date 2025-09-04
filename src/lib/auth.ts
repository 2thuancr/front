// Auth utility functions to avoid circular dependencies
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

export const handleUnauthorized = () => {
  console.log('🔒 Unauthorized access - clearing auth data and redirecting');
  
  // Clear auth data
  clearAuthData();
  
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

export const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
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
