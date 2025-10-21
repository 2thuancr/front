'use client';

import { useWishlistInit } from '@/hooks/useWishlistInit';
import { resetWishlistStorage } from '@/store/wishlistSlice';

/**
 * Component to initialize wishlist state when app loads
 */
export const WishlistInitializer: React.FC = () => {
  useWishlistInit();
  
  return null;
};
