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
      // Only run once and when not already loading
      if (didInitialize.current || userProfileLoading) {
        return;
      }

      // Check if we have a token but no user profile
      const token = localStorage.getItem('token');
      if (token && !userProfile && isTokenValid()) {
        console.log('🔄 AuthInitializer: Auto-fetching user profile...');
        didInitialize.current = true;
        
        try {
          await dispatch(fetchUserProfile()).unwrap();
          console.log('✅ AuthInitializer: User profile fetched successfully');
        } catch (error: any) {
          console.error('❌ AuthInitializer: Failed to fetch user profile:', error);
          
          // If 401 Unauthorized, token is invalid/expired
          if (error?.response?.status === 401) {
            console.log('🔒 AuthInitializer: Token expired, clearing auth data...');
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            localStorage.removeItem('userId');
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

    initializeAuth();
  }, [dispatch, userProfile, userProfileLoading]);

  // This component doesn't render anything
  return null;
};
