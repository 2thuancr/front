"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchCart,
  removeFromCart,
  updateQuantity,
} from "@/store/cartSlice";
import { isCartEndpointAvailable, productAPI } from "@/lib/api";
import Link from "next/link";
import { CartItem } from "@/types/cart";
import { motion, AnimatePresence } from "framer-motion";
import { useUserId } from "@/hooks/useUserId";
import Image from "next/image";
import { Check, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

interface CartItemWithImage extends CartItem {
  imageUrl?: string;
}

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: cart, loading, error } = useSelector(
    (state: RootState) => state.cart
  );
  const userId = useUserId();
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [cartItemsWithImages, setCartItemsWithImages] = useState<CartItemWithImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  // Fetch product images when cart items change (not quantity changes)
  useEffect(() => {
    if (cart?.cartItems && cart.cartItems.length > 0) {
      // Only fetch images if we don't have images yet or cart items count changed
      if (cartItemsWithImages.length === 0 || cartItemsWithImages.length !== cart.cartItems.length) {
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
            
            // Find primary image
            const primaryImage = product.images?.find((img: any) => 
              Boolean(img.isPrimary) || img.isPrimary === 1
            );
            const imageUrl = primaryImage?.imageUrl || product.images?.[0]?.imageUrl || '/images/placeholder.svg';
            
            return {
              ...item,
              imageUrl
            };
          } catch (error) {
            console.error(`Failed to fetch image for product ${item.productId}:`, error);
            return {
              ...item,
              imageUrl: '/images/placeholder.svg'
            };
          }
        })
      );
      
      setCartItemsWithImages(itemsWithImages);
      // Only select all items by default if no items are currently selected
      setSelectedItems(prev => {
        if (prev.size === 0) {
          return new Set(itemsWithImages.map(item => item.cartItemId));
        }
        return prev;
      });
    } catch (error) {
      console.error('Failed to fetch product images:', error);
      setCartItemsWithImages(cart.cartItems.map(item => ({
        ...item,
        imageUrl: '/images/placeholder.svg'
      })));
    } finally {
      setLoadingImages(false);
    }
  };

  const handleRemove = (itemId: number) => {
    dispatch(removeFromCart(itemId));
    // Remove from selected items
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
    // Remove from local cartItemsWithImages
    setCartItemsWithImages(prev => prev.filter(item => item.cartItemId !== itemId));
  };

  const handleUpdateQty = (itemId: number, qty: number) => {
    if (qty <= 0) return;
    dispatch(updateQuantity({ itemId, quantity: qty }));
    
    // Update local cartItemsWithImages to reflect quantity change
    setCartItemsWithImages(prev => 
      prev.map(item => 
        item.cartItemId === itemId 
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const handleSelectItem = (itemId: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cartItemsWithImages.length) {
      // Deselect all
      setSelectedItems(new Set());
    } else {
      // Select all
      setSelectedItems(new Set(cartItemsWithImages.map(item => item.cartItemId)));
    }
  };

  const handleRemoveSelected = () => {
    selectedItems.forEach(itemId => {
      dispatch(removeFromCart(itemId));
    });
    setSelectedItems(new Set());
    // Remove selected items from local cartItemsWithImages
    setCartItemsWithImages(prev => prev.filter(item => !selectedItems.has(item.cartItemId)));
  };

  // Calculate totals for selected items only
  const selectedItemsData = cartItemsWithImages.filter(item => selectedItems.has(item.cartItemId));
  const selectedTotal = selectedItemsData.reduce(
    (sum: number, item: CartItemWithImage) => sum + item.price * item.quantity,
    0
  );
  const selectedItemsCount = selectedItemsData.reduce(
    (sum: number, item: CartItemWithImage) => sum + item.quantity,
    0
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
          {error === 'Cart endpoint not available' ? (
            <div className="mt-4">
              <p className="text-gray-600 text-sm mb-4">
                Tính năng giỏ hàng tạm thời không khả dụng. Vui lòng thử lại sau.
              </p>
              <Link
                href="/products"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <button
              onClick={() => userId && isCartEndpointAvailable('carts/user') && dispatch(fetchCart(userId))}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Thử lại
            </button>
          )}
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
          <p className="text-gray-500 text-sm mt-2">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục</p>
          <Link
            href="/products"
            className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Tiếp tục mua sắm
          </Link>
        </motion.div>
      </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Giỏ hàng của bạn</h1>
          <p className="text-gray-600">
            Bạn có {cartItemsWithImages.length} sản phẩm trong giỏ hàng
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Select All */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === cartItemsWithImages.length && cartItemsWithImages.length > 0}
                      onChange={handleSelectAll}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    {selectedItems.size === cartItemsWithImages.length && cartItemsWithImages.length > 0 && (
                      <Check className="absolute top-0 left-0 w-5 h-5 text-blue-600 pointer-events-none" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Chọn tất cả ({selectedItems.size}/{cartItemsWithImages.length})
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

            {/* Cart Items List */}
            <AnimatePresence>
              {cartItemsWithImages.map((item: CartItemWithImage) => (
                <motion.div
                  key={item.cartItemId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 mb-4 p-4 ${
                    selectedItems.has(item.cartItemId) ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div className="flex-shrink-0 pt-1">
                      <label className="cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.cartItemId)}
                            onChange={() => handleSelectItem(item.cartItemId)}
                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          {selectedItems.has(item.cartItemId) && (
                            <Check className="absolute top-0 left-0 w-5 h-5 text-blue-600 pointer-events-none" />
                          )}
                        </div>
                      </label>
                    </div>

                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <Image
                        src={item.imageUrl || '/images/placeholder.svg'}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-blue-600 mb-2">
                        {item.price.toLocaleString()}₫
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => handleUpdateQty(item.cartItemId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-md hover:bg-gray-200 transition text-gray-700"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQty(item.cartItemId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-md hover:bg-gray-200 transition text-gray-700"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          Tổng: {(item.price * item.quantity).toLocaleString()}₫
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleRemove(item.cartItemId)}
                        className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sản phẩm đã chọn:</span>
                  <span className="font-medium">{selectedItemsCount} sản phẩm</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">{selectedTotal.toLocaleString()}₫</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">{selectedTotal.toLocaleString()}₫</span>
                </div>
              </div>

              {selectedItems.size > 0 ? (
                <button
                  onClick={() => {
                    // Save selected items to localStorage before navigating
                    const selectedItemsData = cartItemsWithImages.filter(item => selectedItems.has(item.cartItemId));
                    localStorage.setItem('checkoutItems', JSON.stringify(selectedItemsData));
                    window.location.href = '/checkout';
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition duration-200 text-center"
                >
                  Thanh toán ({selectedItemsCount} sản phẩm)
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
                >
                  Chọn sản phẩm để thanh toán
                </button>
              )}

              <Link
                href="/products"
                className="w-full mt-3 text-center text-blue-600 hover:text-blue-700 font-medium transition"
              >
                Tiếp tục mua sắm
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}