import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, UpdateProfileData } from '@/types/user';
import { userAPI } from '@/lib/api';

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      // console.log('🔄 fetchUserProfile thunk started');
      
      const token = localStorage.getItem('token');
      if (!token) {
        // console.log('⚠️ No token found in localStorage');
        return rejectWithValue('No authentication token found');
      }

      // Try to get user data from localStorage first (fallback)
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          // console.log('✅ Using user data from localStorage:', user);
          return user;
        } catch (parseError) {
          console.error('❌ Failed to parse user data from localStorage:', parseError);
        }
      }

      // If no localStorage data, try API
      // console.log('📡 Calling userAPI.getProfile()...');
      const response = await userAPI.getProfile();
      // console.log('✅ Profile API response:', response.data);
      
      // Save user data to localStorage for future use
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error: any) {
      console.error('💥 fetchUserProfile error:', error);
      
      // If API fails, try to use localStorage data as fallback
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          // console.log('✅ Fallback: Using user data from localStorage after API error:', user);
          return user;
        } catch (parseError) {
          console.error('❌ Failed to parse user data from localStorage:', parseError);
        }
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch profile';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData: UpdateProfileData, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Get user ID from state or localStorage
      const state = getState() as any;
      const userId = state.user.profile?.userId || state.user.profile?.id;
      
      if (!userId) {
        throw new Error('User ID not found');
      }

      // console.log('📡 Calling userAPI.updateProfile() with userId:', userId);
      const response = await userAPI.updateProfile(userId, profileData);
      // console.log('✅ Update profile API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('💥 updateUserProfile error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
      return rejectWithValue(errorMessage);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setProfile } = userSlice.actions;
export default userSlice.reducer;

