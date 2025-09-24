'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { productAPI, cartApi, productStatsApi } from '@/lib/api';
import { viewTracker } from '@/lib/viewTracker';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { WishlistButton, ProductStats, SimilarProducts, ProductReviews } from '@/components/ui';
import { Product } from '@/types/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cartId, setCartId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const hasTrackedRef = useRef(false);
  const userId = useSelector((state: RootState) => state.user?.profile?.id);

  // 🔹 Load sản phẩm + giỏ hàng
  useEffect(() => {
    // Reset tracking state when product ID changes
    setHasTrackedView(false);
    hasTrackedRef.current = false;
    
    async function fetchProduct() {
      try {
        if (!id) return;
        const numericId = Number(id);
        console.log("📦 Lấy chi tiết sản phẩm ID:", numericId);

        const res = await productAPI.getProductById(numericId);
        const productData = res.data?.product || res.data;

        console.log("✅ Dữ liệu sản phẩm:", productData);
        setProduct(productData);
      } catch (error) {
        console.error("❌ Lỗi khi load chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCart() {
      if (!userId) {
        console.warn("⚠️ Chưa có userId trong localStorage");
        return;
      }

      try {
        console.log("🛒 Lấy giỏ hàng cho user:", userId);
        const cart = await cartApi.getCartByUser(userId);

        console.log("✅ Dữ liệu giỏ hàng:", cart);

        // sửa cart.id → cart.cartId
        setCartId(cart.cartId);
      } catch (error) {
        console.error("❌ Lỗi khi lấy giỏ hàng:", error);
      }
    }

    fetchProduct();
    fetchCart();
  }, [id, userId]);

  // 🔹 Track product view separately to avoid double calls
  useEffect(() => {
    const trackView = async () => {
      if (!id || !userId || hasTrackedRef.current) return;
      
      const numericId = Number(id);
      try {
        console.log("📊 Tracking product view for ID:", numericId);
        const result = await viewTracker.trackView(numericId, productStatsApi.trackProductView);
        if (result.tracked) {
          hasTrackedRef.current = true;
          setHasTrackedView(true);
          console.log("✅ Product view tracked successfully");
        } else {
          console.log("ℹ️ Product view not tracked:", result.message);
        }
      } catch (error) {
        console.error("❌ Error tracking product view:", error);
      }
    };

    trackView();
  }, [id, userId]);

  // 🔹 Xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    console.log("👉 Click thêm giỏ hàng", { product, cartId, quantity, userId });

    if (!product) {
      alert("Không tìm thấy sản phẩm");
      return;
    }
    if (!cartId) {
      alert("Không tìm thấy giỏ hàng");
      return;
    }

    setAdding(true);
    try {
      const res = await cartApi.addToCart(cartId, product.productId, quantity);
      console.log("✅ API addToCart response:", res);

      alert("✅ Đã thêm vào giỏ hàng!");
    } catch (error: any) {
      console.error("❌ Lỗi khi thêm giỏ hàng:", error);
      alert("❌ Thêm giỏ hàng thất bại");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="text-center py-8">Đang tải chi tiết sản phẩm...</div>;
  if (!product) return <div className="text-center py-8 text-red-500">Không tìm thấy sản phẩm</div>;

  return (
    <div className="container mx-auto py-12">
      <Link href="/products" className="text-blue-500 hover:underline mb-6 inline-block">
        ← Quay lại
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Swiper Hình ảnh */}
        <div className="rounded-xl shadow-lg overflow-hidden">
          <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} className="rounded-xl">
            {product.images && product.images.length > 0 ? (
              product.images.map((img: any, index: number) => (
                <SwiperSlide key={index}>
                  <img
                    src={img.imageUrl}
                    alt={product.productName}
                    className="w-full h-[450px] object-cover"
                  />
                </SwiperSlide>
              ))
            ) : (
              ["/images/ao-thun-hcmute.jpg", "/images/ba-lo-hcmute.jpg", "/images/hcmute-logo.png"].map(
                (src, index) => (
                  <SwiperSlide key={index}>
                    <img src={src} alt={`Ảnh mặc định ${index + 1}`} className="w-full h-[450px] object-cover" />
                  </SwiperSlide>
                )
              )
            )}
          </Swiper>
        </div>

        {/* Thông tin sản phẩm */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold">{product.productName}</h1>
            <WishlistButton productId={product.productId} size="lg" />
          </div>
          
          <p className="text-gray-500 text-sm mb-2">
            Danh mục:{" "}
            <span className="font-medium text-black">
              {product.category?.categoryName || "Chưa phân loại"}
            </span>
          </p>

          <p className="text-red-600 text-3xl font-bold mb-4">
            {Number(product.price).toLocaleString()}₫
          </p>

          {/* Product Stats */}
          <div className="mb-6">
            <ProductStats productId={product.productId} compact={true} />
          </div>

          <p className="mb-6 text-gray-700 leading-relaxed">{product.description}</p>

          <p className="text-sm text-gray-600 mb-6">
            {product.stockQuantity > 0
              ? `Còn ${product.stockQuantity} sản phẩm`
              : "Hết hàng"}
          </p>

          {/* Số lượng */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2 border rounded-l-lg bg-gray-100 hover:bg-gray-200"
            >
              -
            </button>
            <span className="px-6 py-2 border-t border-b">{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="px-4 py-2 border rounded-r-lg bg-gray-100 hover:bg-gray-200"
            >
              +
            </button>
          </div>

          {/* Nút thêm giỏ hàng */}
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={product.stockQuantity <= 0 || adding}
          >
            {adding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
          </button>
        </div>
      </div>

      {/* Similar Products */}
      <div className="mt-16">
        <SimilarProducts productId={product.productId} />
      </div>

      {/* Product Reviews */}
      <div className="mt-16">
        <ProductReviews productId={product.productId} />
      </div>
    </div>
  );
}
