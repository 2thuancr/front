import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchWishlist } from '@/store/wishlistSlice';
import { isTokenValid } from '@/lib/auth';

/**
 * Simple hook to initialize wishlist state when app loads
 */
export const useWishlistInit = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.wishlist);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Check authentication directly from localStorage to avoid circular dependency
    const token = localStorage.getItem('token');
    const isAuthenticated = token && isTokenValid();
    
    // Fetch wishlist when user is authenticated and we haven't fetched yet
    if (isAuthenticated && !hasFetched.current) {
      hasFetched.current = true;
      console.log("🔄 Initializing wishlist state...");
      dispatch(fetchWishlist());
    }
  }, [dispatch])

  return {
    isInitializing: loading && items.length === 0,
  };
};
