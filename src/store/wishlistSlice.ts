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
      return { productId, wishlistItem: response.data || response };
    } catch (error: any) {
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
        const { productId, wishlistItem } = action.payload;
        // Add to items if not already present
        const existingIndex = state.items.findIndex(item => item.productId === productId);
        if (existingIndex === -1) {
          state.items.push(wishlistItem);
        }
        // Update checked items cache
        state.checkedItems[productId] = true;
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
  },
});

export const { clearError, clearWishlist, updateCheckedItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;
