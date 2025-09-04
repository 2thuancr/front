import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store/index';
import {
  loginUser,
  registerUser,
  logoutUser,
  clearError,
  restoreAuth,
  verifyOTP,
  resendOTP,
} from '@/store/authSlice';
import { fetchUserProfile } from '@/store/userSlice';
import { LoginCredentials, RegisterCredentials, VerifyOTPData } from '@/types/auth';
import { useEffect } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user: authUser, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const { profile: userProfile } = useSelector(
    (state: RootState) => state.user
  );

  // Use userProfile from userSlice if available, otherwise fallback to authUser
  const user = userProfile || authUser;

  // Check if we have a token in localStorage as fallback
  const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const actualIsAuthenticated = isAuthenticated || !!localStorageToken;

  // Auto-fetch user profile if authenticated but no user data
  useEffect(() => {
    const fetchUserIfNeeded = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        
        // If we have token but no user data, fetch user profile
        if (token && !user && actualIsAuthenticated) {
          console.log('🔄 Auto-fetching user profile...');
          try {
            await dispatch(fetchUserProfile()).unwrap();
            console.log('✅ User profile fetched successfully');
          } catch (error) {
            console.error('❌ Failed to fetch user profile:', error);
            // If fetch fails, clear invalid token
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            dispatch(logoutUser());
          }
        }
      }
    };

    fetchUserIfNeeded();
  }, [dispatch, user, actualIsAuthenticated]);

  console.log('🔐 useAuth hook:', { 
    authUser,
    userProfile,
    user, // Final user object
    token, 
    isAuthenticated, 
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
      if (result.access_token) {
        console.log('💾 Saving token to localStorage:', result.access_token ? 'exists' : 'null');
        
        localStorage.setItem('token', result.access_token);
        
        if (result.refresh_token) {
          localStorage.setItem('refresh_token', result.refresh_token);
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
      // Note: Register might not return tokens immediately, OTP verification will handle auth
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logout attempt...');
      await dispatch(logoutUser()).unwrap();
      
      // Clear all auth data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      // Clear Redux Persist storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('persist:root');
      }
      
      console.log('✅ All auth data cleared from localStorage and Redux Persist');
      console.log('🔄 Redirecting to home...');
      
      router.push('/');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if logout fails, clear localStorage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('persist:root');
      }
      router.push('/');
    }
  };

  const verifyOTPCode = async (data: VerifyOTPData) => {
    try {
      const result = await dispatch(verifyOTP(data)).unwrap();
      if (result.access_token) {
        localStorage.setItem('token', result.access_token);
        if (result.refresh_token) {
          localStorage.setItem('refresh_token', result.refresh_token);
        }
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        router.push('/profile');
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const resendOTPCode = async (email: string) => {
    try {
      const result = await dispatch(resendOTP(email)).unwrap();
      return result;
    } catch (error) {
      throw error;
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
    verifyOTPCode,
    resendOTPCode,
    clearAuthError,
  };
};

