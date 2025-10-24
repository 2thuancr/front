// Order Types
export interface Order {
  orderId: number;
  orderNumber: string;
  userId: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  shippingInfo?: ShippingInfo; // Made optional to handle cases where it might be null/undefined
  orderItems?: OrderItem[];
  orderDetails?: OrderItem[]; // Backend uses this field name
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  orderItemId?: number;
  orderDetailId?: number; // Backend uses this field name
  orderId: number;
  productId: number;
  productName?: string;
  quantity: number;
  price?: number;
  unitPrice?: number; // Backend uses this field name
  totalPrice?: number;
  imageUrl?: string;
  product?: {
    productId: number;
    productName: string;
    price: number;
    images?: Array<{
      imageId: number;
      productId: number;
      imageUrl: string;
      isPrimary: boolean;
    }>;
  };
}

export interface ShippingInfo {
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  district?: string;
  ward: string;
  notes?: string;
}

// Payment Types
export interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  iconUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  paymentId: number;
  orderId: number;
  paymentMethodId: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transactionId?: string;
  gatewayResponse?: any;
  createdAt: string;
  updatedAt: string;
  paymentMethod?: PaymentMethod;
}

export interface PaymentTransaction {
  transactionId: number;
  paymentId: number;
  gateway: string;
  gatewayTransactionId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  gatewayResponse: any;
  createdAt: string;
  updatedAt: string;
}

// Checkout Types
export interface CheckoutRequest {
  userId: number;
  totalAmount: string; // Backend expects string
  paymentMethod: string; // Payment method code (COD, BANK_TRANSFER, etc.)
  shippingAddress: string; // Combined address string
  notes?: string;
  orderDetails: Array<{
    productId: number;
    quantity: number;
    unitPrice: string; // Backend expects string
  }>;
}

export interface CheckoutResponse {
  success: boolean;
  data: {
    order: Order;
    payment: Payment;
    paymentUrl?: string; // For e-wallet payments
  };
  message: string;
}

// Order Status Types
export interface OrderStatusUpdate {
  orderId: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
}

// Payment Gateway Types
export interface VNPayConfig {
  vnp_TmnCode: string;
  vnp_HashSecret: string;
  vnp_Url: string;
  vnp_ReturnUrl: string;
}

export interface MoMoConfig {
  partnerCode: string;
  accessKey: string;
  secretKey: string;
  endpoint: string;
  returnUrl: string;
}

export interface ZaloPayConfig {
  appId: string;
  key1: string;
  key2: string;
  endpoint: string;
  returnUrl: string;
}
