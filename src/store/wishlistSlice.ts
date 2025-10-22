import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WishlistItem, WishlistCheckResponse } from '@/types/api';
import { wishlistApi } from '@/lib/api';

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  checkedItems: Record<number, boolean>; // Cache for checked items
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
  checkedItems: {},
};

// Async Thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.getWishlist();
      console.log('📋 Raw wishlist response:', response);
      
      // Handle different response formats
      let wishlistItems = [];
      if (response.wishlist && Array.isArray(response.wishlist)) {
        wishlistItems = response.wishlist;
      } else if (response.data && Array.isArray(response.data)) {
        wishlistItems = response.data;
      } else if (Array.isArray(response)) {
        wishlistItems = response;
      } else if (response.items && Array.isArray(response.items)) {
        wishlistItems = response.items;
      }
      
      console.log('📋 Processed wishlist items:', wishlistItems);
      return wishlistItems;
    } catch (error: any) {
      console.error('❌ Error fetching wishlist:', error);
      return rejectWithValue(error.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.addToWishlist(productId);
      console.log('✅ Added to wishlist:', response);
      return { 
        productId, 
        wishlistItem: response.wishlistItem, 
        alreadyExists: response.alreadyExists || false 
      };
    } catch (error: any) {
      console.error('❌ Error adding to wishlist:', error);
      return rejectWithValue(error.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: number, { rejectWithValue }) => {
    try {
      await wishlistApi.removeProductFromWishlist(productId);
      console.log('🗑️ Removed from wishlist:', productId);
      return productId;
    } catch (error: any) {
      console.error('❌ Error removing from wishlist:', error);
      return rejectWithValue(error.message || 'Failed to remove from wishlist');
    }
  }
);

export const checkInWishlist = createAsyncThunk(
  'wishlist/checkInWishlist',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.checkInWishlist(productId);
      console.log('🔍 Checked wishlist:', { productId, exists: response.exists });
      return { productId, isInWishlist: response.exists };
    } catch (error: any) {
      console.error('❌ Error checking wishlist:', error);
      return { productId, isInWishlist: false };
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (productId: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { wishlist: WishlistState };
      const isInWishlist = state.wishlist.checkedItems[productId] || false;
      
      console.log('🔄 Toggle wishlist:', { productId, isInWishlist });
      
      if (isInWishlist) {
        // Remove from wishlist
        const response = await wishlistApi.removeProductFromWishlist(productId);
        console.log('🗑️ Removed from wishlist:', response);
        return { productId, action: 'removed' };
      } else {
        // Add to wishlist
        const response = await wishlistApi.addToWishlist(productId);
        console.log('✅ Added to wishlist:', response);
        
        if (response.alreadyExists) {
          return { productId, action: 'already_exists' };
        } else {
          return { productId, action: 'added', wishlistItem: response.wishlistItem };
        }
      }
    } catch (error: any) {
      console.error('❌ Error toggling wishlist:', error);
      return rejectWithValue(error.message || 'Failed to toggle wishlist');
    }
  }
);

export const getMostWishlisted = createAsyncThunk(
  'wishlist/getMostWishlisted',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.getMostWishlisted(limit);
      return response.products || response.data || [];
    } catch (error: any) {
      console.warn('⚠️ Wishlist feature not available yet');
      return [];
    }
  }
);

// Slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearWishlist: (state) => {
      state.items = [];
      state.checkedItems = {};
    },
    updateCheckedItem: (state, action: PayloadAction<{ productId: number; isInWishlist: boolean }>) => {
      state.checkedItems[action.payload.productId] = action.payload.isInWishlist;
    },
  },
  extraReducers: (builder) => {
    // Fetch Wishlist
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        
        // Handle different response formats
        let wishlistItems = [];
        if (action.payload.wishlists && Array.isArray(action.payload.wishlists)) {
          // Format: { wishlists: [...], total: 2, page: "1", limit: "10" }
          wishlistItems = action.payload.wishlists;
        } else if (Array.isArray(action.payload)) {
          // Format: [...] (direct array)
          wishlistItems = action.payload;
        } else if (action.payload.data && Array.isArray(action.payload.data)) {
          // Format: { data: [...] }
          wishlistItems = action.payload.data;
        }
        
        state.items = wishlistItems;
        
        // Update checked items cache
        wishlistItems.forEach((item: WishlistItem) => {
          if (item.productId) {
            state.checkedItems[item.productId] = true;
          }
        });
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add to Wishlist
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const { productId, wishlistItem, alreadyExists } = action.payload;
        
        if (alreadyExists) {
          // Item already exists in wishlist, just update the cache
          state.checkedItems[productId] = true;
        } else {
          // Add to items if not already present
          const existingIndex = state.items.findIndex(item => item.productId === productId);
          if (existingIndex === -1 && wishlistItem) {
            state.items.push(wishlistItem);
          }
          // Update checked items cache
          state.checkedItems[productId] = true;
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Remove from Wishlist
    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        const productId = action.payload;
        // Remove from items
        state.items = state.items.filter(item => item.productId !== productId);
        // Update checked items cache
        state.checkedItems[productId] = false;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Check in Wishlist
    builder
      .addCase(checkInWishlist.fulfilled, (state, action) => {
        const { productId, isInWishlist } = action.payload;
        state.checkedItems[productId] = isInWishlist;
      });

    // Toggle Wishlist
    builder
      .addCase(toggleWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const { productId, action: actionType, wishlistItem } = action.payload;
        
        if (actionType === 'removed') {
          // Remove from items
          state.items = state.items.filter(item => item.productId !== productId);
          // Update checked items cache
          state.checkedItems[productId] = false;
        } else if (actionType === 'added') {
          // Add to items if not already present
          const existingIndex = state.items.findIndex(item => item.productId === productId);
          if (existingIndex === -1 && wishlistItem) {
            state.items.push(wishlistItem);
          }
          // Update checked items cache
          state.checkedItems[productId] = true;
        } else if (actionType === 'already_exists') {
          // Item already exists, just update cache
          state.checkedItems[productId] = true;
        }
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearWishlist, updateCheckedItem } = wishlistSlice.actions;

// Helper function to reset wishlist localStorage
export const resetWishlistStorage = () => {
  if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('persist:root')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.wishlist) {
            data.wishlist = {
              items: [],
              loading: false,
              error: null,
              checkedItems: {},
            };
            localStorage.setItem(key, JSON.stringify(data));
          }
        } catch (error) {
          console.error('Error resetting wishlist storage:', error);
        }
      }
    });
  }
};

// Helper action to sync wishlist status for a specific product
export const syncWishlistStatus = (productId: number, isInWishlist: boolean) => 
  updateCheckedItem({ productId, isInWishlist });
export default wishlistSlice.reducer;
