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
import { clearWishlist } from '@/store/wishlistSlice';
import { 
  LoginCredentials, 
  RegisterCredentials, 
  VerifyOTPData, 
  UserRole, 
  AdminRole,
  hasRole, 
  hasAnyRole, 
  User,
  Admin,
  Vendor,
  Staff,
  getUserType,
  isAdmin,
  isVendor,
  isStaff,
  isCustomer,
  GoogleLoginCredentials
} from '@/types/auth';
import { isTokenValid } from '@/lib/auth';
import { useEffect, useRef } from 'react';

// Helper function to get redirect path based on user type
const getRedirectPath = (userType: string) => {
  switch (userType) {
    case 'admin':
      return '/admin/dashboard';
    case 'vendor':
      return '/vendor/dashboard';
    case 'staff':
      return '/staff/dashboard';
    default:
      return '/'; // Customer
  }
};

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user: authUser, userType, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const { profile: userProfile } = useSelector(
    (state: RootState) => state.user
  );

  // Use userProfile from userSlice if available, otherwise fallback to authUser
  // Cast to union type since we need role and isActive for role checking
  const user = (userProfile || authUser) as User | Admin | Vendor | Staff | null;

  // Check if we have a token in localStorage as fallback
  const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const actualIsAuthenticated = isAuthenticated || !!localStorageToken;

  // Ref to prevent multiple profile fetches
  const didFetchProfile = useRef(false);
  const isCheckingAuth = useRef(false);

  // Auto-fetch user profile if authenticated but no user data
  useEffect(() => {
    const fetchUserIfNeeded = async () => {
      // Add delay to prevent interference with login redirect
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (typeof window !== 'undefined' && !isCheckingAuth.current) {
        const token = localStorage.getItem('token');
        
        // Check if token is valid before making API calls
        if (token && !isTokenValid()) {
          // console.log('🔒 Token is expired or invalid, clearing auth data...');
          // console.log('🔍 useAuth: Current path:', window.location.pathname);
          
          // Don't redirect if we're on public pages (home, products, about, contact)
          const publicPaths = ['/', '/products', '/about', '/contact', '/login'];
          const isPublicPage = publicPaths.includes(window.location.pathname);
          
          if (!isPublicPage) {
            // console.log('🔄 useAuth: Redirecting to login');
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            dispatch(logoutUser());
            router.push('/login');
          } else {
            // console.log('🔍 useAuth: On public page, clearing auth data but not redirecting');
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            dispatch(clearWishlist());
            dispatch(logoutUser());
          }
          return;
        }

        // Re-enable auto-fetch profile with better logic
        if (token && !userProfile && !didFetchProfile.current && isTokenValid()) {
          isCheckingAuth.current = true;
          didFetchProfile.current = true;
          // console.log('🔄 Auto-fetching user profile...');
          // console.log('🔍 useAuth: Current path during profile fetch:', window.location.pathname);
          
          try {
            await dispatch(fetchUserProfile()).unwrap();
            // console.log('✅ User profile fetched successfully');
            // console.log('🔍 useAuth: Current path after profile fetch:', window.location.pathname);
          } catch (error: any) {
            console.error('❌ Failed to fetch user profile:', error);
            // If 401 Unauthorized, token is invalid/expired
            if (error?.response?.status === 401) {
              // console.log('🔒 useAuth: Token expired, redirecting to login');
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
  }, [dispatch, router, userProfile]); // Removed 'user' from dependencies

  // Only log in development and limit frequency
  if (process.env.NODE_ENV === 'development') {
    // Reduced logging to avoid console spam
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      // console.log('🚀 Login attempt with:', credentials);
      const result = await dispatch(loginUser(credentials)).unwrap();
      // console.log('📡 Login result:', result);
      
      // Check what we got from the API
      if (result.access_token) {
        // console.log('💾 Saving token to localStorage:', result.access_token ? 'exists' : 'null');
        // console.log('🔍 Token format check:', {
        //   length: result.access_token.length,
        //   parts: result.access_token.split('.').length,
        //   firstChars: result.access_token.substring(0, 20) + '...'
        // });
        
        localStorage.setItem('token', result.access_token);
        
        if (result.refresh_token) {
          localStorage.setItem('refresh_token', result.refresh_token);
        }
        
        // Save user data based on userType
        let userData;
        if (result.userType === 'admin') {
          userData = result.admin;
        } else if (result.userType === 'vendor') {
          userData = result.vendor;
        } else if (result.userType === 'staff') {
          // Handle staff data from both customer API and staff API
          if (result.staff) {
            // console.log('🔐 Setting staff user from staff API:', result.staff);
            userData = result.staff;
          } else if (result.user && result.user.role === 'staff') {
            // console.log('🔐 Setting staff user from customer API:', result.user);
            userData = result.user;
          }
          
          // Log staff ID for debugging
          if (userData) {
            // console.log('🔐 Staff ID:', userData.staffId || userData.id);
          }
        } else {
          userData = result.user;
        }
        
        if (userData) {
          // console.log('👤 User data to save:', userData);
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('userType', result.userType);
          
          // Set userId based on user type
          let userIdToSave = null;
          if (userData.id) {
            userIdToSave = userData.id;
            localStorage.setItem('userId', JSON.stringify(userData.id));
          } else if (userData.staffId) {
            userIdToSave = userData.staffId;
            localStorage.setItem('userId', JSON.stringify(userData.staffId));
          } else if (userData.adminId) {
            userIdToSave = userData.adminId;
            localStorage.setItem('userId', JSON.stringify(userData.adminId));
          } else if (userData.vendorId) {
            userIdToSave = userData.vendorId;
            localStorage.setItem('userId', JSON.stringify(userData.vendorId));
          }
          
          // console.log('👤 User ID saved to localStorage:', userIdToSave);
        }
        
            // console.log('✅ Auth data saved to localStorage');
            // console.log('🔍 localStorage check:', {
            //   token: localStorage.getItem('token'),
            //   user: localStorage.getItem('user'),
            //   userType: localStorage.getItem('userType')
            // });
        
        // Auto-redirect based on user type
        const redirectPath = getRedirectPath(result.userType);
        // console.log('🔄 Auto-redirecting to:', redirectPath);
        // console.log('🔍 Current path before redirect:', window.location.pathname);
        
        // Force redirect using window.location.href (like vendor login)
        setTimeout(() => {
          // console.log('🔄 Executing redirect to:', redirectPath);
          window.location.href = redirectPath;
        }, 100);
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

  const googleLogin = async (googleToken: string) => {
    try {
      // Import authAPI dynamically to avoid circular dependency
      const { authAPI } = await import('@/lib/api');
      
      const response = await authAPI.googleLogin(googleToken);
      const result = response.data;
      
      if (result.access_token) {
        localStorage.setItem('token', result.access_token);
        
        if (result.refresh_token) {
          localStorage.setItem('refresh_token', result.refresh_token);
        }
        
        // Save user data based on userType
        let userData;
        if (result.userType === 'admin') {
          userData = result.admin;
        } else if (result.userType === 'vendor') {
          userData = result.vendor;
        } else if (result.userType === 'staff') {
          userData = result.staff;
        } else {
          userData = result.user;
        }
        
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('userType', result.userType);
          
          // Set userId based on user type
          let userIdToSave = null;
          if (userData.id) {
            userIdToSave = userData.id;
            localStorage.setItem('userId', JSON.stringify(userData.id));
          } else if (userData.staffId) {
            userIdToSave = userData.staffId;
            localStorage.setItem('userId', JSON.stringify(userData.staffId));
          } else if (userData.adminId) {
            userIdToSave = userData.adminId;
            localStorage.setItem('userId', JSON.stringify(userData.adminId));
          } else if (userData.vendorId) {
            userIdToSave = userData.vendorId;
            localStorage.setItem('userId', JSON.stringify(userData.vendorId));
          }
        }
        
        // Auto-redirect based on user type
        const redirectPath = getRedirectPath(result.userType);
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 100);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Google login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // console.log('🚪 Logout attempt...');
      await dispatch(logoutUser()).unwrap();
      
      // Clear wishlist state
      dispatch(clearWishlist());
      
      // Clear all auth data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      
      // Clear Redux Persist storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('persist:root');
      }
      
      // console.log('✅ All auth data and wishlist cleared from localStorage and Redux Persist');
      // console.log('🔄 Redirecting to home...');
      
      router.push('/');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if logout fails, clear localStorage and redirect
      dispatch(clearWishlist());
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
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
  const checkRole = (role: UserRole | AdminRole) => hasRole(user, role);
  const checkAnyRole = (roles: (UserRole | AdminRole)[]) => hasAnyRole(user, roles);

  return {
    user,
    userType,
    token,
    isAuthenticated: actualIsAuthenticated,
    isLoading,
    error,
    login,
    register,
    googleLogin,
    logout,
    verifyOTPCode,
    resendOTPCode,
    clearAuthError,
    // Role checking functions
    hasRole: checkRole,
    hasAnyRole: checkAnyRole,
    // Type checking functions
    isAdmin: () => isAdmin(user),
    isVendor: () => isVendor(user),
    isStaff: () => isStaff(user),
    isCustomer: () => isCustomer(user),
    getUserType: () => getUserType(user),
  };
};

