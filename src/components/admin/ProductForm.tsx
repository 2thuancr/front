'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  AlertCircle,
  Package,
  DollarSign,
  Percent,
  Hash,
  FileText,
  Tag
} from 'lucide-react';
import { adminProductAPI } from '@/lib/api';
import { useToastSuccess, useToastError } from '@/components/ui/Toast';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ProductFormData {
  productName: string;
  description: string;
  price: string;
  discountPercent?: string;
  stockQuantity: string;
  categoryId: string;
}

interface ImageFile {
  file: File;
  preview: string;
  isPrimary: boolean;
}

const schema = yup.object({
  productName: yup.string().required('Tên sản phẩm là bắt buộc'),
  description: yup.string().required('Mô tả sản phẩm là bắt buộc'),
  price: yup.string().required('Giá sản phẩm là bắt buộc').matches(/^\d+$/, 'Giá phải là số'),
  discountPercent: yup.string().optional().matches(/^\d*\.?\d*$/, 'Phần trăm giảm giá không hợp lệ'),
  stockQuantity: yup.string().required('Số lượng tồn kho là bắt buộc').matches(/^\d+$/, 'Số lượng phải là số'),
  categoryId: yup.string().required('Danh mục là bắt buộc'),
});

export default function ProductForm({ isOpen, onClose, onSuccess }: ProductFormProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      productName: '',
      description: '',
      price: '',
      discountPercent: '0',
      stockQuantity: '',
      categoryId: '',
    } as ProductFormData
  });

  // Mock categories - thay thế bằng API call thực tế
  const categories = [
    { categoryId: 1, categoryName: 'Điện thoại' },
    { categoryId: 2, categoryName: 'Laptop' },
    { categoryId: 3, categoryName: 'Máy tính bảng' },
    { categoryId: 4, categoryName: 'Đồng hồ thông minh' },
    { categoryId: 5, categoryName: 'Phụ kiện' },
    { categoryId: 6, categoryName: 'Tivi & Âm thanh' },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        const newImage: ImageFile = {
          file,
          preview,
          isPrimary: images.length === 0 // First image is primary
        };
        setImages(prev => [...prev, newImage]);
      }
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // If we removed the primary image, make the first remaining image primary
      if (prev[index]?.isPrimary && newImages.length > 0 && newImages[0]) {
        newImages[0].isPrimary = true;
      }
      return newImages;
    });
  };

  const setPrimaryImage = (index: number) => {
    setImages(prev => 
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    );
  };

  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) {
      toastError('Lỗi', 'Vui lòng thêm ít nhất một ảnh sản phẩm');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare form data
      const formData = new FormData();
      formData.append('productName', data.productName);
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('discountPercent', data.discountPercent || '0');
      formData.append('stockQuantity', data.stockQuantity);
      formData.append('categoryId', data.categoryId);

      // Add images
      images.forEach((image, index) => {
        formData.append('images', image.file);
        formData.append(`imagePrimary_${index}`, image.isPrimary.toString());
      });

      const response = await adminProductAPI.createProduct(formData);
      
      toastSuccess('Thành công', 'Đã thêm sản phẩm mới');
      handleClose();
      onSuccess();
      
    } catch (error: any) {
      console.error('❌ Error creating product:', error);
      toastError('Lỗi', error.response?.data?.message || 'Không thể tạo sản phẩm mới');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setImages([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-10 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Thêm sản phẩm mới</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit as any)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="w-4 h-4 inline mr-2" /> 
                Tên sản phẩm *
              </label>
              <input
                {...register('productName')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên sản phẩm"
              />
              {errors.productName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.productName.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Danh mục *
              </label>
              <select
                {...register('categoryId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Chọn danh mục</option>
                {categories.map(category => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Giá sản phẩm (VNĐ) *
              </label>
              <input
                {...register('price')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập giá sản phẩm"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Percent className="w-4 h-4 inline mr-2" />
                Phần trăm giảm giá (%)
              </label>
              <input
                {...register('discountPercent')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
              {errors.discountPercent && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.discountPercent.message}
                </p>
              )}
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-2" />
                Số lượng tồn kho *
              </label>
              <input
                {...register('stockQuantity')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập số lượng tồn kho"
              />
              {errors.stockQuantity && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.stockQuantity.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Mô tả sản phẩm *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập mô tả chi tiết về sản phẩm"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="w-4 h-4 inline mr-2" />
              Hình ảnh sản phẩm *
            </label>
            
            {/* Upload Button */}
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm ảnh</span>
              </button>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Primary Badge */}
                    {image.isPrimary && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Ảnh chính
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!image.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(index)}
                          className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
                          title="Đặt làm ảnh chính"
                        >
                          <Package className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                        title="Xóa ảnh"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {images.length === 0 && (
              <p className="text-sm text-gray-500">Chưa có ảnh nào được thêm</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Tạo sản phẩm</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
