import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchWishlist } from '@/store/wishlistSlice';
import { useAuth } from './useAuth';

/**
 * Simple hook to initialize wishlist state when app loads
 */
export const useWishlistInit = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();
  const { items, loading } = useSelector((state: RootState) => state.wishlist);

  useEffect(() => {
    // Only fetch if user is authenticated and we don't have wishlist data yet
    if (isAuthenticated && items.length === 0 && !loading) {
      console.log('🔄 Initializing wishlist state...');
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]); // Only depend on auth state

  return {
    isInitializing: loading && items.length === 0,
  };
};
