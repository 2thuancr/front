import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Cart, CartItem } from "../types/cart";
import { cartApi } from "@/lib/api";

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
  const response = await cartApi.getCartByUser(userId);
  console.log("🛒 API Cart Response:", response.data);
  const apiData = response;

  // Chuẩn hóa dữ liệu từ API
  const cart: Cart = {
    cartId: apiData.cartId,
    userId: apiData.userId,
    cartItems: apiData.cartItems.map((ci: any): CartItem => ({
      cartItemId: ci.cartItemId,
      cartId: ci.cartId,
      productId: ci.productId, // lấy từ cartItem
      name: ci.product.productName,
      price: Number(ci.product.price),
      quantity: ci.quantity,
      imageUrl: ci.product.imageUrl || undefined, // nếu API có thì lấy
    })),
    totalPrice: apiData.cartItems.reduce(
      (sum: number, ci: any) => sum + Number(ci.product.price) * ci.quantity,
      0
    ),
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
  };

  return cart;
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
      );
  },
});

export default cartSlice.reducer;
