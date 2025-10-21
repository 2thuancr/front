'use client';

import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchUserProfile } from '@/store/userSlice';
import { clearWishlist } from '@/store/wishlistSlice';
import { restoreAuth } from '@/store/authSlice';
import { isTokenValid } from '@/lib/auth';

/**
 * Component to automatically initialize user authentication state
 * This ensures user profile is fetched when the app starts if user is logged in
 */
export const AuthInitializer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userProfile = useSelector((state: RootState) => state.user?.profile);
  const userProfileLoading = useSelector((state: RootState) => state.user?.isLoading);
  const authState = useSelector((state: RootState) => state.auth);
  const didInitialize = useRef(false);

  useEffect(() => {
    const initializeAuth = async () => {
      
      
      // Only run once and when not already loading
      if (didInitialize.current || userProfileLoading) {
        return;
      }

      // First, try to restore auth state from localStorage if not already authenticated
      if (!authState.isAuthenticated) {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        const userType = localStorage.getItem('userType');
        
        
        
        if (token && user && userType && isTokenValid()) {
          try {
            const userData = JSON.parse(user);
            dispatch(restoreAuth({
              user: userData,
              token,
              userType
            }));
          } catch (error) {
            
            // Clear invalid data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userType');
          }
        }
      }

      // Check if we have a token but no user profile
      const token = localStorage.getItem('token');

      if (token && !userProfile && isTokenValid()) {
        didInitialize.current = true;
        
        try {
          await dispatch(fetchUserProfile()).unwrap();
          
        } catch (error: any) {
          
          // If 401 Unauthorized, token is invalid/expired
          if (error?.response?.status === 401) {
            
            
            // Don't clear auth data if we're on public pages
            const publicPaths = ['/', '/products', '/about', '/contact', '/login'];
            const isPublicPage = publicPaths.includes(window.location.pathname);
            
            if (!isPublicPage) {
              localStorage.removeItem('token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('user');
              localStorage.removeItem('userId');
            } else {
              localStorage.removeItem('token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('user');
              localStorage.removeItem('userId');
              dispatch(clearWishlist());
            }
          }
        }
      } else if (token && userProfile) {
        didInitialize.current = true;
      } else if (!token) {
        didInitialize.current = true;
      }
    };

    // Add delay to prevent interference with login redirect
    setTimeout(() => {
      initializeAuth();
    }, 200);
  }, [dispatch]); // Removed userProfile and userProfileLoading from dependencies

  // This component doesn't render anything
  return null;
};
