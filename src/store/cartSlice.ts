import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Cart, CartItem } from "../types/cart";
import { cartApi, voucherApi } from "@/lib/api";

// ================== STATE ==================
interface CartState {
  data: Cart | null;
  loading: boolean;
  error: string | null;

  // Voucher-related
  appliedVoucher: any | null;
  discount: number;
  grandTotal: number;
  applyingVoucher: boolean;
  voucherError: string | null;
}

const initialState: CartState = {
  data: null,
  loading: false,
  error: null,

  appliedVoucher: null,
  discount: 0,
  grandTotal: 0,
  applyingVoucher: false,
  voucherError: null,
};

// helpers
const computeItemsTotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);

const syncGrandTotal = (state: CartState) => {
  const total = state.data ? computeItemsTotal(state.data.cartItems) : 0;
  if (state.data) state.data.totalPrice = total;
  state.grandTotal = Math.max(0, total - Number(state.discount || 0));
};

// ================== THUNKS GIỎ HÀNG ==================

// 🛒 Lấy giỏ hàng theo userId
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId: number) => {
  try {
    const response = await cartApi.getCartByUser(userId);
    const apiData = (response as any)?.data || response;

    const cartItems = apiData?.cartItems || [];
    const cart: Cart = {
      cartId: apiData.cartId || 0,
      userId: apiData.userId || userId,
      cartItems: Array.isArray(cartItems)
        ? cartItems.map((ci: any): CartItem => ({
            cartItemId: ci.cartItemId || 0,
            cartId: ci.cartId || apiData.cartId || 0,
            productId: ci.productId || 0,
            name: ci.product?.productName || ci.name || "Unknown Product",
            price: Number(ci.product?.price || ci.price || 0),
            quantity: ci.quantity || 0,
            imageUrl: ci.product?.imageUrl || ci.imageUrl || undefined,
          }))
        : [],
      totalPrice: Array.isArray(cartItems)
        ? cartItems.reduce(
            (sum: number, ci: any) =>
              sum + Number(ci.product?.price || ci.price || 0) * (ci.quantity || 0),
            0
          )
        : 0,
      createdAt: apiData.createdAt,
      updatedAt: apiData.updatedAt,
    };

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

// ================== THUNKS VOUCHER ==================

// 🎟️ Áp mã voucher (tính trước khi thanh toán)
export const applyVoucher = createAsyncThunk(
  "cart/applyVoucher",
  async (code: string, { getState, rejectWithValue }: any) => {
    try {
      const state = getState() as { cart: CartState };
      const total = state.cart.data ? computeItemsTotal(state.cart.data.cartItems) : 0;

      const res = await voucherApi.apply(code.trim(), total);
      const data = (res as any)?.data || res;

      if (!data?.valid) return rejectWithValue("Voucher invalid");
      return {
        discount: Number(data.discount || 0),
        finalAmount: Number(data.finalAmount || 0),
        voucher: data.voucher || null,
      };
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to apply voucher";
      return rejectWithValue(msg);
    }
  }
);

// 🔁 Áp lại mã theo tổng hiện tại (khi thay đổi giỏ)
export const reapplyVoucher = createAsyncThunk(
  "cart/reapplyVoucher",
  async (_: void, { getState, dispatch, rejectWithValue }: any) => {
    const state = getState() as { cart: CartState };
    const code = state.cart.appliedVoucher?.code;
    if (!code) return null;
    try {
      const result = await dispatch(applyVoucher(code));
      return (result as any).payload || null;
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to re-apply voucher");
    }
  }
);

// 🧽 Gỡ voucher
export const clearVoucher = createAsyncThunk("cart/clearVoucher", async () => true);

// ================== SLICE ==================
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
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.data = action.payload;
        if (!state.appliedVoucher) state.discount = 0; // nếu chưa có mã, reset discount
        syncGrandTotal(state);
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
          syncGrandTotal(state);
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
            syncGrandTotal(state);
          }
        }
      )

      // applyVoucher
      .addCase(applyVoucher.pending, (state) => {
        state.applyingVoucher = true;
        state.voucherError = null;
      })
      .addCase(
        applyVoucher.fulfilled,
        (
          state,
          action: PayloadAction<{ discount: number; finalAmount: number; voucher: any }>
        ) => {
          state.applyingVoucher = false;
          state.voucherError = null;
          state.appliedVoucher = action.payload.voucher;
          state.discount = action.payload.discount;
          state.grandTotal = action.payload.finalAmount; // theo BE
        }
      )
      .addCase(applyVoucher.rejected, (state, action: any) => {
        state.applyingVoucher = false;
        state.voucherError =
          action.payload || action.error?.message || "Apply voucher failed";
      })

      // reapplyVoucher
      .addCase(reapplyVoucher.fulfilled, (state, action: any) => {
        if (action?.payload?.discount != null) {
          state.discount = action.payload.discount;
          state.grandTotal = action.payload.finalAmount;
          state.voucherError = null;
        } else {
          // không có payload => giữ discount hiện có, chỉ sync lại tổng
          syncGrandTotal(state);
        }
      })
      .addCase(reapplyVoucher.rejected, (state, action: any) => {
        // nếu áp lại thất bại (vd không đủ min), gỡ mã
        state.appliedVoucher = null;
        state.discount = 0;
        state.voucherError =
          action.payload || action.error?.message || "Re-apply voucher failed";
        syncGrandTotal(state);
      })

      // clearVoucher
      .addCase(clearVoucher.fulfilled, (state) => {
        state.appliedVoucher = null;
        state.discount = 0;
        state.voucherError = null;
        syncGrandTotal(state);
      });
  },
});

export default cartSlice.reducer;
