import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Cart, CartItem } from "../types/cart";
import { cartApi, isCartEndpointAvailable } from "@/lib/api";

interface CartState {
  data: Cart | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  data: null,
  loading: false,
  error: null,
};

// 🛒 Lấy giỏ hàng theo userId
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId: number) => {
  try {
    // Check if user is authenticated before making API call
    const authToken = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
    if (!authToken) {
      console.log("🔒 User not authenticated - skipping cart fetch");
      throw new Error("User not authenticated");
    }

    const response = await cartApi.getCartByUser(userId);
    console.log("🛒 API Cart Response:", response);
    
    // Kiểm tra response có tồn tại không
    if (!response) {
      throw new Error("No response from API");
    }

    const apiData = response.data || response;
    console.log("🛒 API Data:", apiData);

    // Kiểm tra cartItems có tồn tại và là array không
    const cartItems = apiData.cartItems || [];
    console.log("🛒 Cart Items:", cartItems);

    // Chuẩn hóa dữ liệu từ API
    const cart: Cart = {
      cartId: apiData.cartId || 0,
      userId: apiData.userId || userId,
      cartItems: Array.isArray(cartItems) ? cartItems.map((ci: any): CartItem => ({
        cartItemId: ci.cartItemId || 0,
        cartId: ci.cartId || apiData.cartId || 0,
        productId: ci.productId || 0,
        name: ci.product?.productName || ci.name || "Unknown Product",
        price: Number(ci.product?.price || ci.price || 0),
        quantity: ci.quantity || 0,
        imageUrl: ci.product?.imageUrl || ci.imageUrl || undefined,
      })) : [],
      totalPrice: Array.isArray(cartItems) ? cartItems.reduce(
        (sum: number, ci: any) => sum + Number(ci.product?.price || ci.price || 0) * (ci.quantity || 0),
        0
      ) : 0,
      createdAt: apiData.createdAt,
      updatedAt: apiData.updatedAt,
    };

    console.log("🛒 Processed Cart:", cart);
    return cart;
  } catch (error) {
    console.error("❌ Error in fetchCart:", error);
    throw error;
  }
});

// ❌ Xóa item khỏi giỏ hàng
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (itemId: number) => {
  await cartApi.removeFromCart(itemId);
  return itemId; // để reducer filter
});

// 🔄 Cập nhật số lượng sản phẩm
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
    await cartApi.updateQuantity(itemId, quantity);
    return { itemId, quantity };
  }
);

// 🗑️ Xóa nhiều items khỏi giỏ hàng (sau khi checkout)
export const removeMultipleFromCart = createAsyncThunk(
  "cart/removeMultipleFromCart",
  async (itemIds: number[]) => {
    // Xóa từng item
    await Promise.all(itemIds.map(itemId => cartApi.removeFromCart(itemId)));
    return itemIds;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cart";
      })

      // removeFromCart
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<number>) => {
        if (state.data) {
          state.data.cartItems = state.data.cartItems.filter(
            (item) => item.cartItemId !== action.payload
          );
          state.data.totalPrice = state.data.cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
        }
      })

      // updateQuantity
      .addCase(
        updateQuantity.fulfilled,
        (state, action: PayloadAction<{ itemId: number; quantity: number }>) => {
          if (state.data) {
            state.data.cartItems = state.data.cartItems.map((item) =>
              item.cartItemId === action.payload.itemId
                ? { ...item, quantity: action.payload.quantity }
                : item
            );
            state.data.totalPrice = state.data.cartItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
          }
        }
      )

      // removeMultipleFromCart
      .addCase(removeMultipleFromCart.fulfilled, (state, action: PayloadAction<number[]>) => {
        if (state.data) {
          state.data.cartItems = state.data.cartItems.filter(
            (item) => !action.payload.includes(item.cartItemId)
          );
          state.data.totalPrice = state.data.cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
        }
      });
  },
});

export default cartSlice.reducer;
