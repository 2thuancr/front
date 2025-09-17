'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { productAPI } from '@/lib/api';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';



export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        if (!id) return;
        const numericId = Number(id);
        const res = await productAPI.getProductById(numericId);
        const productData = res.data.product || res.data;
        setProduct(productData);
      } catch (error) {
        console.error("Lỗi khi load chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

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
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="rounded-xl"
          >
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
              // Nếu API KHÔNG có ảnh → hiển thị ảnh mẫu trong thư mục public/images
                    ["/images/ao-thun-hcmute.jpg", "/images/ba-lo-hcmute.jpg", "/images/hcmute-logo.png"].map(
                    (src, index) => (
                    <SwiperSlide key={index}>
                        <img
                        src={src}
                        alt={`Ảnh mặc định ${index + 1}`}
                        className="w-full h-[450px] object-cover"
                        />
                    </SwiperSlide>
                    )
                )
            )}
          </Swiper>
        </div>

        {/* Thông tin sản phẩm */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.productName}</h1>
          <p className="text-gray-500 text-sm mb-2">
            Danh mục:{" "}
            <span className="font-medium text-black">
              {product.category?.categoryName || "Chưa phân loại"}
            </span>
          </p>

          <p className="text-red-600 text-3xl font-bold mb-4">
            {Number(product.price).toLocaleString()}₫
          </p>

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
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={product.stockQuantity <= 0}
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}
