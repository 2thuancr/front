'use client';

import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchUserProfile } from '@/store/userSlice';
import { isTokenValid } from '@/lib/auth';

/**
 * Component to automatically initialize user authentication state
 * This ensures user profile is fetched when the app starts if user is logged in
 */
export const AuthInitializer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userProfile = useSelector((state: RootState) => state.user?.profile);
  const userProfileLoading = useSelector((state: RootState) => state.user?.isLoading);
  const didInitialize = useRef(false);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 AuthInitializer: Starting initialization...');
      console.log('🔍 AuthInitializer: Current state:', {
        didInitialize: didInitialize.current,
        userProfileLoading,
        currentPath: window.location.pathname
      });
      
      // Only run once and when not already loading
      if (didInitialize.current || userProfileLoading) {
        console.log('🔍 AuthInitializer: Skipping - already initialized or loading');
        return;
      }

      // Check if we have a token but no user profile
      const token = localStorage.getItem('token');
      console.log('🔍 AuthInitializer: Token check:', {
        tokenExists: !!token,
        hasUserProfile: !!userProfile,
        isTokenValid: token ? isTokenValid() : false
      });
      
      if (token && !userProfile && isTokenValid()) {
        console.log('🔄 AuthInitializer: Auto-fetching user profile...');
        console.log('🔍 AuthInitializer: Current path before profile fetch:', window.location.pathname);
        didInitialize.current = true;
        
        try {
          await dispatch(fetchUserProfile()).unwrap();
          console.log('✅ AuthInitializer: User profile fetched successfully');
          console.log('🔍 AuthInitializer: Current path after profile fetch:', window.location.pathname);
        } catch (error: any) {
          console.error('❌ AuthInitializer: Failed to fetch user profile:', error);
          
          // If 401 Unauthorized, token is invalid/expired
          if (error?.response?.status === 401) {
            console.log('🔒 AuthInitializer: Token expired, clearing auth data...');
            console.log('🔍 AuthInitializer: Current path:', window.location.pathname);
            
            // Don't clear auth data if we're on login page
            if (window.location.pathname !== '/login') {
              console.log('🔄 AuthInitializer: Clearing auth data');
              localStorage.removeItem('token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('user');
              localStorage.removeItem('userId');
            } else {
              console.log('🔍 AuthInitializer: On login page, not clearing auth data');
            }
          }
        }
      } else if (token && userProfile) {
        console.log('✅ AuthInitializer: User profile already loaded');
        didInitialize.current = true;
      } else if (!token) {
        console.log('👤 AuthInitializer: No token found, user not authenticated');
        didInitialize.current = true;
      }
    };

    // Add delay to prevent interference with login redirect
    setTimeout(() => {
      console.log('🔄 AuthInitializer: Starting after delay');
      initializeAuth();
    }, 200);
  }, [dispatch]); // Removed userProfile and userProfileLoading from dependencies

  // This component doesn't render anything
  return null;
};
