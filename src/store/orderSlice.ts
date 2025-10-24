import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Order, OrderItem, PaymentMethod, Payment, CheckoutRequest, CheckoutResponse } from "../types/order";
import { orderApi, paymentApi } from "@/lib/api";

// Helper function to transform backend order data to frontend format
const transformOrderData = (backendOrder: any): Order => {
  return {
    orderId: backendOrder.orderId,
    orderNumber: backendOrder.orderId.toString(), // Use orderId as orderNumber if not provided
    userId: backendOrder.userId,
    totalAmount: parseFloat(backendOrder.totalAmount),
    status: backendOrder.status.toLowerCase(), // Convert to lowercase
    paymentMethod: backendOrder.paymentMethod,
    paymentStatus: backendOrder.paymentStatus,
    shippingInfo: backendOrder.shippingAddress ? {
      customerName: backendOrder.user?.firstName + ' ' + backendOrder.user?.lastName || 'N/A',
      customerPhone: backendOrder.user?.phone || 'N/A',
      shippingAddress: backendOrder.shippingAddress,
      city: backendOrder.user?.city || 'N/A',
      district: 'N/A', // Not provided by backend
      ward: 'N/A', // Not provided by backend
      notes: backendOrder.notes || ''
    } : undefined,
    orderItems: backendOrder.orderDetails?.map((detail: any) => ({
      orderItemId: detail.orderDetailId,
      orderId: detail.orderId,
      productId: detail.productId,
      quantity: detail.quantity,
      price: parseFloat(detail.unitPrice),
      product: detail.product ? {
        productId: detail.product.productId,
        productName: detail.product.productName,
        price: parseFloat(detail.product.price),
        images: detail.product.images?.map((img: any) => ({
          imageId: img.imageId,
          productId: img.productId,
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary
        })) || []
      } : undefined
    })) || [],
    createdAt: backendOrder.orderDate,
    updatedAt: backendOrder.orderDate
  };
};

// Order State Interface
interface OrderState {
  // Orders
  orders: Order[];
  currentOrder: Order | null;
  ordersLoading: boolean;
  ordersError: string | null;
  
  // Payment Methods
  paymentMethods: PaymentMethod[];
  paymentMethodsLoading: boolean;
  paymentMethodsError: string | null;
  
  // Checkout
  checkoutLoading: boolean;
  checkoutError: string | null;
  checkoutSuccess: boolean;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalOrders: number;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  ordersLoading: false,
  ordersError: null,
  
  paymentMethods: [],
  paymentMethodsLoading: false,
  paymentMethodsError: null,
  
  checkoutLoading: false,
  checkoutError: null,
  checkoutSuccess: false,
  
  currentPage: 1,
  totalPages: 1,
  totalOrders: 0,
};

// 🛒 Lấy danh sách đơn hàng của user
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async ({ userId, page = 1, limit = 10 }: { userId: number; page?: number; limit?: number }) => {
    const response = await orderApi.getOrdersByUser(userId, page, limit);
    const backendOrders = response.data || response;
    
    // Transform each order
    const transformedOrders = Array.isArray(backendOrders) 
      ? backendOrders.map(transformOrderData)
      : [];
    
    return {
      orders: transformedOrders,
      pagination: response.pagination || { currentPage: page, totalPages: 1, total: 0 }
    };
  }
);

// 📦 Lấy chi tiết đơn hàng
export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async (orderId: number) => {
    const response = await orderApi.getOrderById(orderId);
    const backendOrder = response.data || response;
    
    // Transform backend data to frontend format
    return transformOrderData(backendOrder);
  }
);

// 💳 Lấy danh sách phương thức thanh toán
export const fetchPaymentMethods = createAsyncThunk(
  "order/fetchPaymentMethods",
  async () => {
    const response = await paymentApi.getPaymentMethods();
    return response.data || response;
  }
);

// 🛍️ Tạo đơn hàng mới (Checkout)
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (checkoutData: CheckoutRequest, { rejectWithValue }) => {
    try {
      const response = await orderApi.createOrder(checkoutData);
      return response.data || response;
    } catch (error: any) {
      // Extract error message from response
      const errorMessage = error.response?.data?.message || error.message || "Failed to create order";
      return rejectWithValue(errorMessage);
    }
  }
);

// 💰 Xử lý thanh toán
export const processPayment = createAsyncThunk(
  "order/processPayment",
  async ({ orderId, paymentData }: { orderId: number; paymentData: any }) => {
    const response = await orderApi.processPayment(orderId, paymentData);
    return response.data || response;
  }
);

// ❌ Hủy đơn hàng
export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (orderId: number) => {
    const response = await orderApi.cancelOrder(orderId);
    return response.data || response;
  }
);

// 🔄 Cập nhật trạng thái đơn hàng
export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, status, notes }: { orderId: number; status: string; notes?: string }) => {
    const response = await orderApi.updateOrderStatus(orderId, { status, notes });
    return response.data || response;
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // Reset checkout state
    resetCheckout: (state) => {
      state.checkoutLoading = false;
      state.checkoutError = null;
      state.checkoutSuccess = false;
    },
    
    // Clear current order
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    
    // Set current page
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload.orders;
        state.currentPage = action.payload.pagination.currentPage;
        state.totalPages = action.payload.pagination.totalPages;
        state.totalOrders = action.payload.pagination.total;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.error.message || "Failed to fetch orders";
      })

      // Fetch Order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.error.message || "Failed to fetch order";
      })

      // Fetch Payment Methods
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.paymentMethodsLoading = true;
        state.paymentMethodsError = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.paymentMethodsLoading = false;
        state.paymentMethods = action.payload;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.paymentMethodsLoading = false;
        state.paymentMethodsError = action.error.message || "Failed to fetch payment methods";
      })

      // Create Order (Checkout)
      .addCase(createOrder.pending, (state) => {
        state.checkoutLoading = true;
        state.checkoutError = null;
        state.checkoutSuccess = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutSuccess = true;
        state.currentOrder = action.payload.order;
        // Add to orders list if not already there
        const existingOrder = state.orders.find(order => order.orderId === action.payload.order.orderId);
        if (!existingOrder) {
          state.orders.unshift(action.payload.order);
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutError = (action.payload as string) || action.error.message || "Failed to create order";
        state.checkoutSuccess = false;
      })

      // Process Payment
      .addCase(processPayment.pending, (state) => {
        state.checkoutLoading = true;
        state.checkoutError = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        // Update order payment status
        if (state.currentOrder) {
          state.currentOrder.paymentStatus = action.payload.payment?.status || 'pending';
        }
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutError = action.error.message || "Failed to process payment";
      })

      // Cancel Order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        // Update order in list
        const orderIndex = state.orders.findIndex(order => order.orderId === action.payload.orderId);
        if (orderIndex !== -1 && state.orders[orderIndex]) {
          state.orders[orderIndex].status = 'cancelled';
        }
        // Update current order if it's the same
        if (state.currentOrder && state.currentOrder.orderId === action.payload.orderId) {
          state.currentOrder.status = 'cancelled';
        }
      })

      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        // Update order in list
        const orderIndex = state.orders.findIndex(order => order.orderId === action.payload.orderId);
        if (orderIndex !== -1 && state.orders[orderIndex]) {
          state.orders[orderIndex].status = action.payload.status;
        }
        // Update current order if it's the same
        if (state.currentOrder && state.currentOrder.orderId === action.payload.orderId) {
          state.currentOrder.status = action.payload.status;
        }
      });
  },
});

export const { resetCheckout, clearCurrentOrder, setCurrentPage } = orderSlice.actions;
export default orderSlice.reducer;
