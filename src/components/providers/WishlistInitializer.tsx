'use client';

import { useWishlistInit } from '@/hooks/useWishlistInit';
import { resetWishlistStorage } from '@/store/wishlistSlice';

/**
 * Component to initialize wishlist state when app loads
 */
export const WishlistInitializer: React.FC = () => {
  useWishlistInit();
  
  // Expose reset function to window for debugging
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).resetWishlist = resetWishlistStorage;
    console.log('🔧 Debug: Use window.resetWishlist() to reset wishlist localStorage');
  }
  
  return null;
};
