import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store/index';
import {
  loginUser,
  registerUser,
  logoutUser,
  clearError,
  restoreAuth,
} from '@/store/authSlice';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';
import { useEffect } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Check localStorage token
  const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const actualIsAuthenticated = isAuthenticated || !!localStorageToken;

  // Restore auth state from localStorage on mount
  useEffect(() => {
    if (localStorageToken && !isAuthenticated) {
      console.log('🔄 Restoring auth state from localStorage');
      // Try to restore user data from localStorage if available
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          dispatch(restoreAuth({ user, token: localStorageToken }));
          console.log('✅ Auth state restored from localStorage');
        } catch (error) {
          console.error('❌ Failed to parse user data from localStorage:', error);
        }
      }
    }
  }, [localStorageToken, isAuthenticated, dispatch]);

  console.log('🔐 useAuth hook:', { 
    user, 
    token, 
    isAuthenticated, 
    localStorageToken,
    actualIsAuthenticated,
    isLoading, 
    error 
  });

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('🚀 Login attempt with:', credentials);
      const result = await dispatch(loginUser(credentials)).unwrap();
      console.log('📡 Login result:', result);
      
      // Check what we got from the API
      if (result.token || result.access_token) {
        const tokenToSave = result.token || result.access_token;
        console.log('💾 Saving token to localStorage:', tokenToSave ? 'exists' : 'null');
        
        localStorage.setItem('token', tokenToSave);
        
        if (result.refreshToken) {
          localStorage.setItem('refresh_token', result.refreshToken);
        }
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        
        console.log('✅ Auth data saved to localStorage');
        console.log('🔍 localStorage check:', {
          token: localStorage.getItem('token'),
          user: localStorage.getItem('user')
        });
        
        router.push('/profile');
      } else {
        console.error('❌ No token found in login result:', result);
      }
      return result;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const result = await dispatch(registerUser(credentials)).unwrap();
      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('refresh_token', result.refreshToken);
        router.push('/profile');
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      localStorage.removeItem('token');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isAuthenticated: actualIsAuthenticated, // Use actualIsAuthenticated instead
    isLoading,
    error,
    login,
    register,
    logout,
    clearAuthError,
  };
};

