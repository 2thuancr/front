"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchCart,
  removeFromCart,
  updateQuantity,
  reapplyVoucher,
} from "@/store/cartSlice";
import { isCartEndpointAvailable, productAPI } from "@/lib/api";
import Link from "next/link";
import { CartItem } from "@/types/cart";
import { motion, AnimatePresence } from "framer-motion";
import { useUserId } from "@/hooks/useUserId";
import Image from "next/image";
import {
  Check,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import VoucherModal from "@/components/ui/VoucherModal";
import { useRouter } from "next/navigation";

interface CartItemWithImage extends CartItem {
  imageUrl?: string;
}

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: cart,
    loading,
    error,
    appliedVoucher,
    discount,
    grandTotal,
  } = useSelector((state: RootState) => state.cart);

  const userId = useUserId();
  const router = useRouter();

  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [cartItemsWithImages, setCartItemsWithImages] = useState<CartItemWithImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const authToken = useSelector((state: RootState) => state.auth.token);

  // 🧩 Load cart & voucher
  useEffect(() => {
    if (userId && isAuthenticated && authToken) {
      dispatch(fetchCart(userId)).then(() => {
        dispatch(reapplyVoucher());
      });
    }
  }, [dispatch, userId, isAuthenticated, authToken]);

  // 🧩 Fetch images
  useEffect(() => {
    if (cart?.cartItems && cart.cartItems.length > 0) {
      if (
        cartItemsWithImages.length === 0 ||
        cartItemsWithImages.length !== cart.cartItems.length
      ) {
        fetchProductImages();
      }
    }
  }, [cart?.cartItems?.length]);

  const fetchProductImages = async () => {
    if (!cart?.cartItems) return;

    setLoadingImages(true);
    try {
      const itemsWithImages = await Promise.all(
        cart.cartItems.map(async (item: CartItem) => {
          try {
            const productResponse = await productAPI.getProductById(item.productId);
            const product = productResponse.data;
            const primaryImage =
              product.images?.find((img: any) => img.isPrimary) ||
              product.images?.[0];
            const imageUrl =
              primaryImage?.imageUrl || "/images/placeholder.svg";
            return { ...item, imageUrl };
          } catch {
            return { ...item, imageUrl: "/images/placeholder.svg" };
          }
        })
      );
      setCartItemsWithImages(itemsWithImages);
      setSelectedItems(new Set(itemsWithImages.map((i) => i.cartItemId)));
    } finally {
      setLoadingImages(false);
    }
  };

  // 🧩 Remove item
  const handleRemove = (itemId: number) => {
    dispatch(removeFromCart(itemId)).then(() => {
      dispatch(reapplyVoucher());
    });
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
    setCartItemsWithImages((prev) => prev.filter((i) => i.cartItemId !== itemId));
  };

  // 🧩 Update quantity
  const handleUpdateQty = (itemId: number, qty: number) => {
    if (qty <= 0) return;
    dispatch(updateQuantity({ itemId, quantity: qty })).then(() => {
      dispatch(reapplyVoucher());
    });
    setCartItemsWithImages((prev) =>
      prev.map((i) => (i.cartItemId === itemId ? { ...i, quantity: qty } : i))
    );
  };

  // 🧩 Select
  const handleSelectItem = (itemId: number) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      newSet.has(itemId) ? newSet.delete(itemId) : newSet.add(itemId);
      return newSet;
    });
  };
  const handleSelectAll = () => {
    if (selectedItems.size === cartItemsWithImages.length) setSelectedItems(new Set());
    else setSelectedItems(new Set(cartItemsWithImages.map((i) => i.cartItemId)));
  };
  const handleRemoveSelected = () => {
    selectedItems.forEach((id) => dispatch(removeFromCart(id)));
    setCartItemsWithImages((prev) =>
      prev.filter((i) => !selectedItems.has(i.cartItemId))
    );
    setSelectedItems(new Set());
  };

  // 🧮 Totals
  const selectedItemsData = cartItemsWithImages.filter((i) =>
    selectedItems.has(i.cartItemId)
  );
  const selectedTotal = selectedItemsData.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const selectedItemsCount = selectedItemsData.reduce(
    (sum, i) => sum + i.quantity,
    0
  );

  // 🧩 Auth guard
  if (!userId || !isAuthenticated || !authToken)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Vui lòng đăng nhập
        </h2>
        <Link
          href="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Đăng nhập
        </Link>
      </div>
    );

  if (loading || loadingImages)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-red-50 rounded-xl shadow-lg"
        >
          <p className="text-red-600 text-lg font-medium">{error}</p>
          <button
            onClick={() =>
              userId &&
              isCartEndpointAvailable("carts/user") &&
              dispatch(fetchCart(userId))
            }
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Thử lại
          </button>
        </motion.div>
      </div>
    );

  if (!cart || cart.cartItems.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-white rounded-xl shadow-lg"
        >
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Giỏ hàng trống</p>
          <Link
            href="/products"
            className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Tiếp tục mua sắm
          </Link>
        </motion.div>
      </div>
    );

  const total = cart.cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Giỏ hàng của bạn
          </h1>
          <p className="text-gray-600">
            Bạn có {cartItemsWithImages.length} sản phẩm trong giỏ hàng
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.size === cartItemsWithImages.length &&
                      cartItemsWithImages.length > 0
                    }
                    onChange={handleSelectAll}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Chọn tất cả ({selectedItems.size}/
                    {cartItemsWithImages.length})
                  </span>
                </label>
                {selectedItems.size > 0 && (
                  <button
                    onClick={handleRemoveSelected}
                    className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa đã chọn
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <AnimatePresence>
              {cartItemsWithImages.map((item) => (
                <motion.div
                  key={item.cartItemId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-white rounded-xl shadow-sm mb-4 p-4 ${
                    selectedItems.has(item.cartItemId)
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.cartItemId)}
                      onChange={() => handleSelectItem(item.cartItemId)}
                      className="w-5 h-5 mt-2 text-blue-600 border-gray-300 rounded"
                    />
                    {/* Image */}
                    <Image
                      src={item.imageUrl || "/images/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-blue-600 mb-2">
                        {item.price.toLocaleString()}₫
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleUpdateQty(item.cartItemId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="px-2 py-1 bg-gray-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleUpdateQty(item.cartItemId, item.quantity + 1)
                          }
                          className="px-2 py-1 bg-gray-100 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="ml-3 text-sm text-gray-500">
                          Tổng: {(item.price * item.quantity).toLocaleString()}₫
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(item.cartItemId)}
                      className="text-red-500 hover:text-red-600 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sản phẩm đã chọn:</span>
                  <span className="font-medium">
                    {selectedItemsCount} sản phẩm
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">
                    {selectedTotal.toLocaleString()}₫
                  </span>
                </div>

                {/* Mã giảm giá */}
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Mã giảm giá
                  </p>
                  <button
                    onClick={() => setShowVoucherModal(true)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Chọn mã giảm giá
                  </button>
                  {appliedVoucher && (
                    <p className="mt-2 text-sm text-green-700">
                      Đã áp mã{" "}
                      <span className="font-semibold">
                        {appliedVoucher.code}
                      </span>
                    </p>
                  )}
                </div>

                {/* Tổng cộng */}
                <div className="border-t pt-4 mt-4 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className="font-medium text-green-600">
                      -{Number(discount || 0).toLocaleString()}₫
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Thành tiền:</span>
                    <span className="text-blue-600">
                      {Number(grandTotal || selectedTotal).toLocaleString()}₫
                    </span>
                  </div>
                </div>
              </div>

              {selectedItems.size > 0 ? (
                <button
                  onClick={() => {
                    const selectedData = cartItemsWithImages.filter((i) =>
                      selectedItems.has(i.cartItemId)
                    );
                    localStorage.setItem(
                      "checkoutItems",
                      JSON.stringify(selectedData)
                    );
                    router.push("/checkout");
                  }}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Thanh toán ({selectedItemsCount} sản phẩm)
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg cursor-not-allowed"
                >
                  Chọn sản phẩm để thanh toán
                </button>
              )}
              <Link
                href="/products"
                className="block mt-3 text-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Tiếp tục mua sắm
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Voucher Modal */}
      <VoucherModal
        open={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}
      />
    </div>
  );
}
