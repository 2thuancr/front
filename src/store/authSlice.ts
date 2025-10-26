import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  AuthState, 
  LoginCredentials, 
  RegisterCredentials, 
  User, 
  Admin,
  Vendor,
  Staff,
  VerifyOTPData, 
  UserRole, 
  AdminRole,
  hasRole, 
  hasAnyRole,
  getUserType
} from '@/types/auth';
import { authAPI, adminAuthAPI, vendorAuthAPI, staffAuthAPI } from '@/lib/api';
import { clearAuthData } from '@/lib/auth';
import { clearWishlist } from './wishlistSlice';

// Initial state
const initialState: AuthState = {
  user: null,
  userType: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // console.log('🔐 loginUser thunk - credentials:', credentials);
      
      // Try different login endpoints based on credentials
      let response;
      let userType = 'customer';
      
      // Check if it's email format (customer/staff) or username format (admin/vendor)
      const isEmail = credentials.username.includes('@');
      
      if (isEmail) {
        // Try customer login FIRST for email addresses
        try {
          response = await authAPI.login({
            email: credentials.username,
            password: credentials.password
          });
          
          // Check if this is actually a staff user by checking role in response
          if (response.data.user && response.data.user.role === 'staff') {
            // console.log('🔐 Customer API returned staff user, treating as staff');
            // console.log('🔐 Staff user data:', response.data.user);
            userType = 'staff';
          } else {
            // console.log('🔐 Customer API returned regular customer');
            userType = 'customer';
          }
        } catch (customerError: any) {
          // If customer login fails, try staff login
          try {
            response = await staffAuthAPI.login({
              email: credentials.username,
              password: credentials.password
            });
            userType = 'staff';
            // console.log('🔐 Staff login successful - response:', response.data);
            // console.log('🔐 Staff login successful - userType:', userType);
          } catch (staffError) {
            // console.log('🔐 Both customer and staff login failed');
            throw customerError; // Throw original customer error
          }
        }
      } else {
        // Try admin login first
        try {
          response = await adminAuthAPI.login({
            username: credentials.username,
            password: credentials.password
          });
          userType = 'admin';
        } catch (adminError: any) {
          // Only log if it's not a 401 (unauthorized) error, which is expected for non-admin users
          if (adminError.response?.status !== 401) {
            // console.log('🔐 Admin login failed with unexpected error:', adminError);
          } else {
            // console.log('🔐 Admin login failed (expected for non-admin users), trying vendor login');
          }
          
          // If admin login fails, try vendor login
          try {
            response = await vendorAuthAPI.login({
              username: credentials.username,
              password: credentials.password
            });
            userType = 'vendor';
          } catch (vendorError: any) {
            // Only log if it's not a 401 (unauthorized) error
            if (vendorError.response?.status !== 401) {
              // console.log('🔐 Vendor login failed with unexpected error:', vendorError);
            } else {
              // console.log('🔐 Vendor login also failed (expected for non-vendor users)');
            }
            throw adminError; // Throw original admin error
          }
        }
      }
      
      // console.log('🔐 loginUser thunk - API response:', response.data);
      // console.log('🔐 loginUser thunk - userType:', userType);
      // console.log('🔐 loginUser thunk - response structure:', {
      //   hasUser: !!response.data.user,
      //   hasStaff: !!response.data.staff,
      //   hasAdmin: !!response.data.admin,
      //   hasVendor: !!response.data.vendor,
      //   userRole: response.data.user?.role,
      //   staffRole: response.data.staff?.role
      // });
      
      // Additional role checking for staff
      if (userType === 'staff' && response.data.staff) {
        // console.log('🔐 Staff login detected - staff data:', response.data.staff);
        // console.log('🔐 Staff role:', response.data.staff.role);
      }
      
      const result = { ...response.data, userType };
      // console.log('🔐 loginUser thunk - returning:', result);
      return result;
    } catch (error: any) {
      console.error('🔐 loginUser thunk - error:', error);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);


export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(credentials); // POST /auth/register
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Forgot password failed');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (data: VerifyOTPData, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyOTP(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authAPI.resendOTP(email);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Resend OTP failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    // Clear auth data from localStorage
    clearAuthData();
    
    // Clear wishlist state
    dispatch(clearWishlist());
    
    return null;
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User | Admin | Vendor | Staff>) => {
      state.user = action.payload;
      state.userType = getUserType(action.payload);
      state.isAuthenticated = true;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    restoreAuth: (state, action: PayloadAction<{ user: User | Admin | Vendor | Staff; token: string; userType: string }>) => {
      state.user = action.payload.user;
      state.userType = action.payload.userType as 'customer' | 'admin' | 'vendor' | 'staff';
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // console.log('🔐 loginUser.fulfilled - payload:', action.payload);
        state.isLoading = false;
        state.isAuthenticated = true;
        
        // Set user based on userType
        if (action.payload.userType === 'admin') {
          state.user = action.payload.admin;
        } else if (action.payload.userType === 'vendor') {
          state.user = action.payload.vendor;
        } else if (action.payload.userType === 'staff') {
          // Handle staff data from both customer API and staff API
          if (action.payload.staff) {
            // console.log('🔐 Setting staff user from staff API:', action.payload.staff);
            state.user = action.payload.staff;
          } else if (action.payload.user && action.payload.user.role === 'staff') {
            // console.log('🔐 Setting staff user from customer API:', action.payload.user);
            state.user = action.payload.user;
          }
        } else {
          state.user = action.payload.user;
        }
        
        state.userType = action.payload.userType;
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.error = null;
            // console.log('🔐 loginUser.fulfilled - state after update:', {
            //   user: state.user,
            //   userType: state.userType,
            //   isAuthenticated: state.isAuthenticated
            // });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });


    // REGISTER
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Note: Register might not set authenticated state immediately, OTP verification will handle it
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // VERIFY OTP
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // RESEND OTP
    builder
      .addCase(resendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // LOGOUT
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.userType = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      });

    // UPDATE USER PROFILE
    builder
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Update user profile action
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updatedProfile: Partial<User>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      if (!state.auth.user) {
        throw new Error('No user found');
      }
      
      // Return the updated user data with proper typing
      return {
        ...state.auth.user,
        ...updatedProfile
      } as User;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const { clearError, setUser, setToken, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
