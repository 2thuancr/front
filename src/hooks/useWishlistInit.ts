import { useEffect, useRef } from 'react';
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
  const hasFetched = useRef(false);

  useEffect(() => {
    // Only fetch once if user is authenticated and we don't have wishlist data yet
    if (isAuthenticated && items.length === 0 && !loading && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated, items.length, loading])

  return {
    isInitializing: loading && items.length === 0,
  };
};
