'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { addToWishlist, removeFromWishlist, checkInWishlist, toggleWishlist, fetchWishlist } from '@/store/wishlistSlice';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  productId: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  className,
  size = 'md',
  showText = false,
  variant = 'default',
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();
  const { checkedItems } = useSelector((state: RootState) => state.wishlist);
  
  const [isLoading, setIsLoading] = useState(false);
  const isInWishlist = checkedItems[productId] || false;
  const hasChecked = useRef(false);

  // Check wishlist status only once on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && !hasChecked.current && checkedItems[productId] === undefined) {
      hasChecked.current = true;
      dispatch(checkInWishlist(productId));
    }
  }, [dispatch, isAuthenticated, productId]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      window.location.href = '/login';
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      await dispatch(toggleWishlist(productId)).unwrap();
    } catch (error: any) {
      // Error handled by Redux
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3',
  };

  const variantClasses = {
    default: isInWishlist 
      ? 'text-red-500 bg-red-50 hover:bg-red-100' 
      : 'text-gray-600 hover:text-red-500 hover:bg-red-50',
    outline: isInWishlist
      ? 'text-red-500 border-red-200 bg-red-50 hover:bg-red-100'
      : 'text-gray-600 border-gray-200 hover:text-red-500 hover:border-red-200 hover:bg-red-50',
    ghost: isInWishlist
      ? 'text-red-500 hover:bg-red-50'
      : 'text-gray-600 hover:text-red-500 hover:bg-red-50',
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        buttonSizeClasses[size],
        variantClasses[variant],
        variant === 'outline' && 'border',
        className
      )}
      title={isInWishlist ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
    >
      <Heart 
        className={cn(
          sizeClasses[size],
          isInWishlist ? 'fill-current' : '',
          isLoading ? 'animate-pulse' : ''
        )} 
      />
      {showText && (
        <span className="ml-2 text-sm font-medium">
          {isInWishlist ? 'Đã yêu thích' : 'Yêu thích'}
        </span>
      )}
    </button>
  );
};

export default WishlistButton;
