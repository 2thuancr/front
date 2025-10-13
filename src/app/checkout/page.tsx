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
import { VoucherSelector } from "./components/VoucherSelector";
import { ShippingInfo } from "@/types/order";
import { Voucher } from "@/types/voucher";
import { useUserId } from "@/hooks/useUserId";
import { useToastSuccess } from "@/components/ui/Toast";

export default function CheckoutPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const showSuccessToast = useToastSuccess();
  
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
  
  const userId = useUserId();
  
  // Local state for checkout items
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  
  // Local state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    customerName: "",
    customerPhone: "",
    shippingAddress: "",
    city: "",
    ward: "",
    notes: ""
  });


  // Load checkout items from localStorage on mount
  useEffect(() => {
    const savedCheckoutItems = localStorage.getItem('checkoutItems');
    if (savedCheckoutItems) {
      try {
        const items = JSON.parse(savedCheckoutItems);
        setCheckoutItems(items);
        console.log('✅ Loaded checkout items from localStorage:', items);
      } catch (error) {
        console.error('❌ Failed to parse checkout items:', error);
      }
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
      dispatch(fetchPaymentMethods());
      dispatch(fetchUserProfile());
    }
  }, [dispatch, userId]);

  // Redirect if no checkout items
  useEffect(() => {
    // Thêm delay nhỏ để đảm bảo checkout items đã load xong
    const timer = setTimeout(() => {
      if (checkoutItems.length === 0) {
        console.log('❌ No checkout items found, redirecting to cart');
        router.push("/cart");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [checkoutItems, router]);

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


  const handlePlaceOrder = async () => {
    if (!checkoutItems.length || !userId || !selectedPaymentMethod) return;

    try {
      const checkoutData = {
        cartId: checkoutItems[0]?.cartId || null, // Use cartId from first item
        shippingInfo,
        paymentMethodId: selectedPaymentMethod,
        notes: shippingInfo.notes ?? "",
        selectedItems: checkoutItems.map(item => ({
          cartItemId: item.cartItemId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const result = await dispatch(createOrder(checkoutData)).unwrap();
      
      // Clear checkout items from localStorage after successful order
      localStorage.removeItem('checkoutItems');
      
      // Show success toast
      showSuccessToast(
        'Đặt hàng thành công!',
        `Đơn hàng #${result.order?.orderId || ''} đã được tạo thành công`
      );
      
      // If payment method is COD, redirect to orders page
      const paymentMethod = paymentMethods.find(pm => pm.id === selectedPaymentMethod);
      if (paymentMethod?.code === 'COD') {
        router.push('/orders');
      } else {
        // For e-wallet payments, process payment
        if (result.paymentUrl) {
          window.location.href = result.paymentUrl;
        } else {
          router.push('/orders');
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  if (paymentMethodsLoading) {
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

  if (checkoutItems.length === 0) {
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

                      <VoucherSelector
                        selectedVoucher={selectedVoucher}
                        onVoucherSelect={(voucher) => {
                          setSelectedVoucher(voucher);
                          if (voucher) {
                            const orderTotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                            let discount = 0;
                            
                            if (voucher.discountType === 'percentage') {
                              const percentage = parseFloat(voucher.discountValue || '0');
                              discount = (orderTotal * percentage) / 100;
                              if (voucher.maxDiscount) {
                                discount = Math.min(discount, parseFloat(voucher.maxDiscount));
                              }
                            } else if (voucher.discountType === 'fixed') {
                              discount = parseFloat(voucher.discountValue || '0');
                            } else if (voucher.discountType === 'freeship') {
                              discount = 30000; // Assuming shipping fee is 30k
                            }
                            
                            setDiscountAmount(discount);
                          } else {
                            setDiscountAmount(0);
                          }
                        }}
                        orderTotal={checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                      />
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
            <OrderSummary checkoutItems={checkoutItems} discountAmount={discountAmount} voucherCode={selectedVoucher?.code || null} />
          </div>
        </div>
      </div>
    </div>
  );
}
