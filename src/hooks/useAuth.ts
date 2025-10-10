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
import { LoginCredentials, RegisterCredentials, VerifyOTPData, UserRole, hasRole, hasAnyRole, User } from '@/types/auth';
import { isTokenValid } from '@/lib/auth';
import { useEffect, useRef } from 'react';

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
  // Cast to User type since we need role and isActive for role checking
  const user = (userProfile || authUser) as User | null;

  // Check if we have a token in localStorage as fallback
  const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const actualIsAuthenticated = isAuthenticated || !!localStorageToken;

  // Ref to prevent multiple profile fetches
  const didFetchProfile = useRef(false);
  const isCheckingAuth = useRef(false);

  // Auto-fetch user profile if authenticated but no user data
  useEffect(() => {
    const fetchUserIfNeeded = async () => {
      if (typeof window !== 'undefined' && !isCheckingAuth.current) {
        const token = localStorage.getItem('token');
        
        // Check if token is valid before making API calls
        if (token && !isTokenValid()) {
          console.log('🔒 Token is expired or invalid, clearing auth data...');
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          dispatch(logoutUser());
          router.push('/login');
          return;
        }

        // If we have valid token but no user data, fetch user profile (only once)
        if (token && !user && !didFetchProfile.current && isTokenValid()) {
          isCheckingAuth.current = true;
          didFetchProfile.current = true;
          try {
            await dispatch(fetchUserProfile()).unwrap();
          } catch (error: any) {
            // If 401 Unauthorized, token is invalid/expired
            if (error?.response?.status === 401) {
              localStorage.removeItem('token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('user');
              dispatch(logoutUser());
              router.push('/login');
            }
          } finally {
            isCheckingAuth.current = false;
          }
        }
      }
    };

    fetchUserIfNeeded();
  }, [dispatch, router, user]);

  // Only log in development and limit frequency
  if (process.env.NODE_ENV === 'development') {
    // Reduced logging to avoid console spam
  }

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
          if (result.user.id) {
          localStorage.setItem('userId', JSON.stringify(result.user.id));
        }
        }
        
        console.log('✅ Auth data saved to localStorage');
        console.log('🔍 localStorage check:', {
          token: localStorage.getItem('token'),
          user: localStorage.getItem('user')
        });
        
        // Don't redirect here, let the LoginForm handle redirect
        console.log('🔍 Login successful, not redirecting from useAuth');
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

  // Role checking functions
  const checkRole = (role: UserRole) => hasRole(user, role);
  const checkAnyRole = (roles: UserRole[]) => hasAnyRole(user, roles);

  return {
    user,
    token,
    isAuthenticated: actualIsAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    verifyOTPCode,
    resendOTPCode,
    clearAuthError,
    // Role checking functions
    hasRole: checkRole,
    hasAnyRole: checkAnyRole,
  };
};

