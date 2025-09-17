"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchPaymentMethods } from "@/store/orderSlice";
import { paymentApi, orderApi } from "@/lib/api";

export default function TestCheckoutPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { paymentMethods, paymentMethodsLoading } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  const testAPIs = async () => {
    try {
      console.log("🧪 Testing APIs...");
      
      // Test Payment Methods API
      console.log("1. Testing Payment Methods API...");
      const paymentMethods = await paymentApi.getPaymentMethods();
      console.log("✅ Payment Methods:", paymentMethods);
      
      // Test Order API (if you have test data)
      console.log("2. Testing Order API...");
      try {
        const orders = await orderApi.getOrdersByUser(6); // Replace with actual user ID
        console.log("✅ Orders:", orders);
      } catch (error) {
        console.log("⚠️ Orders API (expected if no orders):", error);
      }
      
      console.log("🎉 All API tests completed!");
    } catch (error) {
      console.error("❌ API Test Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Test Checkout Integration
        </h1>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            API Connection Test
          </h2>
          <button
            onClick={testAPIs}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Test APIs
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Check browser console for API test results
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Payment Methods
          </h2>
          {paymentMethodsLoading ? (
            <p className="text-gray-600">Loading payment methods...</p>
          ) : (
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <div key={method.paymentMethodId} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                  <div className="text-2xl">
                    {method.code === 'COD' ? '💰' : 
                     method.code === 'VNPAY' ? '🏦' :
                     method.code === 'MOMO' ? '💜' :
                     method.code === 'ZALOPAY' ? '💙' : '💳'}
                  </div>
                  <div>
                    <h3 className="font-medium">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                    <p className="text-xs text-gray-500">Code: {method.code}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    method.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {method.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Available Routes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/cart"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="font-medium text-gray-900">Cart Page</h3>
              <p className="text-sm text-gray-600">View and manage cart items</p>
            </a>
            <a
              href="/checkout"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="font-medium text-gray-900">Checkout Page</h3>
              <p className="text-sm text-gray-600">Complete your order</p>
            </a>
            <a
              href="/orders"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="font-medium text-gray-900">Orders Page</h3>
              <p className="text-sm text-gray-600">View order history</p>
            </a>
            <a
              href="/products"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="font-medium text-gray-900">Products Page</h3>
              <p className="text-sm text-gray-600">Browse products</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
