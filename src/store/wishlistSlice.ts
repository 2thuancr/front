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
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.addToWishlist(productId);
      return { productId, wishlistItem: response.data || response, alreadyExists: false };
    } catch (error: any) {
      // Handle 409 Conflict - item already exists in wishlist
      if (error.response?.status === 409) {
        // Treat 409 as success since item is already in wishlist
        return { 
          productId, 
          wishlistItem: null, 
          alreadyExists: true 
        };
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: number, { rejectWithValue }) => {
    try {
      await wishlistApi.removeProductFromWishlist(productId);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

export const checkInWishlist = createAsyncThunk(
  'wishlist/checkInWishlist',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.checkInWishlist(productId);
      return { productId, isInWishlist: response.data?.isInWishlist || false };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check wishlist status');
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (productId: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { wishlist: WishlistState };
      const isInWishlist = state.wishlist.checkedItems[productId] || false;
      
      if (isInWishlist) {
        // Remove from wishlist
        await wishlistApi.removeProductFromWishlist(productId);
        return { productId, action: 'removed' };
      } else {
        // Add to wishlist
        try {
          const response = await wishlistApi.addToWishlist(productId);
          return { productId, action: 'added', wishlistItem: response.data || response };
        } catch (error: any) {
          // Handle 409 Conflict - item already exists
          if (error.response?.status === 409) {
            return { productId, action: 'already_exists' };
          }
          throw error;
        }
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle wishlist');
    }
  }
);

export const getMostWishlisted = createAsyncThunk(
  'wishlist/getMostWishlisted',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.getMostWishlisted(limit);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch most wishlisted');
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
        state.items = action.payload;
        // Update checked items cache
        action.payload.forEach((item: WishlistItem) => {
          state.checkedItems[item.productId] = true;
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

// Helper action to sync wishlist status for a specific product
export const syncWishlistStatus = (productId: number, isInWishlist: boolean) => 
  updateCheckedItem({ productId, isInWishlist });
export default wishlistSlice.reducer;
