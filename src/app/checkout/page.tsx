"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { 
  fetchPaymentMethods, 
  createOrder, 
  processPayment,
  resetCheckout 
} from "@/store/orderSlice";
import { fetchCart } from "@/store/cartSlice";
import { fetchUserProfile } from "@/store/userSlice";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckoutForm } from "./components/CheckoutForm";
import { OrderSummary } from "./components/OrderSummary";
import { PaymentMethodSelector } from "./components/PaymentMethodSelector";
import { CheckoutSuccess } from "./components/CheckoutSuccess";
import { ShippingInfo } from "@/types/order";

export default function CheckoutPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  // Redux state
  const { data: cart, loading: cartLoading } = useSelector((state: RootState) => state.cart);
  const { 
    paymentMethods, 
    paymentMethodsLoading,
    checkoutLoading, 
    checkoutError, 
    checkoutSuccess,
    currentOrder 
  } = useSelector((state: RootState) => state.order);
  
  const userId = useSelector((state: RootState) => state.user?.profile?.id);
  
  // Local state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    customerName: "",
    customerPhone: "",
    shippingAddress: "",
    city: "",
    ward: "",
    notes: ""
  });

  // Load data on mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
      dispatch(fetchPaymentMethods());
      dispatch(fetchUserProfile());
    }
  }, [dispatch, userId]);

  // Redirect if no cart or empty cart (only after loading is complete)
  useEffect(() => {
    // Thêm delay nhỏ để đảm bảo cart đã load xong
    const timer = setTimeout(() => {
      if (!cartLoading && cart && cart.cartItems.length === 0) {
        router.push("/cart");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [cart, cartLoading, router]);

  // Reset checkout state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetCheckout());
    };
  }, [dispatch]);

  // Debug selectedPaymentMethod changes
  useEffect(() => {
    console.log("🔍 selectedPaymentMethod changed:", selectedPaymentMethod);
  }, [selectedPaymentMethod]);

  // Debug paymentMethods changes
  useEffect(() => {
    console.log("🔍 paymentMethods changed:", paymentMethods);
  }, [paymentMethods]);

  const handleShippingInfoChange = (info: ShippingInfo) => {
    setShippingInfo(info);
  };

  const handlePaymentMethodSelect = (paymentMethodId: number) => {
    console.log("🔘 Selecting payment method:", paymentMethodId, "Type:", typeof paymentMethodId);
    console.log("🔘 Current selectedPaymentMethod:", selectedPaymentMethod, "Type:", typeof selectedPaymentMethod);
    setSelectedPaymentMethod(paymentMethodId);
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate shipping info
      if (!shippingInfo.customerName || !shippingInfo.customerPhone || 
          !shippingInfo.shippingAddress || !shippingInfo.city || 
          !shippingInfo.ward) {
        alert("Vui lòng điền đầy đủ thông tin giao hàng");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate payment method
      if (!selectedPaymentMethod) {
        alert("Vui lòng chọn phương thức thanh toán");
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Simple voucher validation (client-side placeholder)
  const applyVoucher = () => {
    if (!voucherCode) return;
    // Demo rules: CODE10 => 10% off; CODE50K => 50,000₫ off; max to subtotal
    const code = voucherCode.trim().toUpperCase();
    const subtotal = cart?.cartItems.reduce((s, i) => s + i.price * i.quantity, 0) || 0;
    let discount = 0;
    if (code === 'CODE10') discount = Math.round(subtotal * 0.1);
    else if (code === 'CODE50K') discount = 50000;
    else discount = 0;
    setDiscountAmount(Math.max(0, Math.min(discount, subtotal)));
  };

  const handlePlaceOrder = async () => {
    if (!cart || !userId || !selectedPaymentMethod) return;

    try {
      const checkoutData = {
        cartId: cart.cartId,
        shippingInfo,
        paymentMethodId: selectedPaymentMethod,
        notes: shippingInfo.notes ?? ""
      };

      const result = await dispatch(createOrder(checkoutData)).unwrap();
      
      // If payment method is COD, show success immediately
      const paymentMethod = paymentMethods.find(pm => pm.id === selectedPaymentMethod);
      if (paymentMethod?.code === 'COD') {
        setCurrentStep(4);
      } else {
        // For e-wallet payments, process payment
        if (result.paymentUrl) {
          window.location.href = result.paymentUrl;
        } else {
          setCurrentStep(4);
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  if (cartLoading || paymentMethodsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-white rounded-xl shadow-lg"
        >
          <p className="text-gray-600 text-lg font-medium">Giỏ hàng trống</p>
          <button
            onClick={() => router.push("/products")}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Tiếp tục mua sắm
          </button>
        </motion.div>
      </div>
    );
  }

  if (checkoutSuccess && currentOrder) {
    return <CheckoutSuccess order={currentOrder} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán</h1>
          <p className="text-gray-600">Hoàn tất đơn hàng của bạn</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: "Thông tin giao hàng", icon: "📍" },
              { step: 2, title: "Phương thức thanh toán", icon: "💳" },
              { step: 3, title: "Xác nhận đơn hàng", icon: "✅" },
              { step: 4, title: "Hoàn thành", icon: "🎉" }
            ].map((item) => (
              <div key={item.step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= item.step 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > item.step ? '✓' : item.step}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= item.step ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {item.title}
                </span>
                {item.step < 4 && (
                  <div className={`w-8 h-0.5 ml-4 ${
                    currentStep > item.step ? 'bg-blue-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckoutForm
                    shippingInfo={shippingInfo}
                    onShippingInfoChange={handleShippingInfoChange}
                    onNext={handleNextStep}
                  />
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PaymentMethodSelector
                    paymentMethods={paymentMethods}
                    selectedPaymentMethod={selectedPaymentMethod}
                    onPaymentMethodSelect={handlePaymentMethodSelect}
                    onNext={handleNextStep}
                    onBack={handleBackStep}
                  />
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Xác nhận đơn hàng
                    </h2>
                    
                    {checkoutError && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{checkoutError}</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Thông tin giao hàng:</h3>
                        <p className="text-gray-600">
                          {shippingInfo.customerName} - {shippingInfo.customerPhone}
                        </p>
                        <p className="text-gray-600">
                          {shippingInfo.shippingAddress}, {shippingInfo.ward}, {shippingInfo.city}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Phương thức thanh toán:</h3>
                        <p className="text-gray-600">
                          {(() => {
                            const pm = paymentMethods.find(pm => pm.id === selectedPaymentMethod);
                            if (!pm) return null;
                            const code = (pm.code || '').toString().toUpperCase();
                            const name = (pm.name || '').toString().toUpperCase();
                            const isCOD = code === 'COD' || name === 'COD' || code.includes('CASH_ON_DELIVERY');
                            return isCOD ? 'Thanh toán khi nhận hàng' : (pm.name || '');
                          })()}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Voucher:</h3>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={voucherCode || ''}
                            onChange={(e) => setVoucherCode(e.target.value)}
                            placeholder="Nhập mã (ví dụ: CODE10, CODE50K)"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={applyVoucher}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            type="button"
                          >
                            Áp dụng
                          </button>
                        </div>
                        {discountAmount > 0 && (
                          <p className="mt-2 text-sm text-green-600">Đã áp dụng giảm {discountAmount.toLocaleString()}₫</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <button
                        onClick={handleBackStep}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                      >
                        Quay lại
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={checkoutLoading}
                        className="px-8 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {checkoutLoading ? "Đang xử lý..." : "Đặt hàng"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary cart={cart} discountAmount={discountAmount} voucherCode={voucherCode} />
          </div>
        </div>
      </div>
    </div>
  );
}
