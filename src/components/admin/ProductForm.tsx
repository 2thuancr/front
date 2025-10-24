'use client';

import React, { useState, useRef, useEffect } from 'react';
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
import { adminProductAPI, adminCategoryAPI } from '@/lib/api';
import { useToastSuccess, useToastError } from '@/components/ui/Toast';
import { Category, CategoriesResponse, Product } from '@/types/api';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null; // Thêm product data cho edit mode
  mode?: 'create' | 'edit'; // Thêm mode để phân biệt create/edit
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

export default function ProductForm({ isOpen, onClose, onSuccess, product, mode = 'create' }: ProductFormProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const categoriesLoadedRef = useRef(false); // Use ref instead of state
  const isFetchingRef = useRef(false); // Track if currently fetching
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

  // Fetch categories from API
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after component unmounts
    
    const fetchCategories = async () => {
      // Prevent multiple simultaneous calls
      if (isFetchingRef.current) {
        console.log('🔄 Categories fetch already in progress, skipping...');
        return;
      }
      
      try {
        isFetchingRef.current = true;
        setCategoriesLoading(true);
        const response = await adminCategoryAPI.getAllCategories(1, 100); // Get all categories
        const data: CategoriesResponse = response.data;
        
        if (isMounted) {
          if (data && data.categories) {
            setCategories(data.categories);
            categoriesLoadedRef.current = true; // Mark as loaded using ref
            console.log('✅ Categories loaded:', data.categories.length);
          } else {
            console.warn('⚠️ No categories data in response:', data);
            setCategories([]);
          }
        }
      } catch (error: any) {
        if (isMounted) {
          console.error('❌ Error fetching categories:', error);
          toastError('Lỗi', 'Không thể tải danh mục sản phẩm');
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setCategoriesLoading(false);
        }
        isFetchingRef.current = false;
      }
    };

    if (isOpen && !categoriesLoadedRef.current) {
      fetchCategories();
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [isOpen]); // Only depend on isOpen, no other dependencies

  // Populate form when in edit mode
  useEffect(() => {
    if (mode === 'edit' && product && isOpen) {
      // Set form values
      setValue('productName', product.productName);
      setValue('description', product.description || '');
      setValue('price', product.price);
      setValue('discountPercent', product.discountPercent || '0');
      setValue('stockQuantity', product.stockQuantity.toString());
      setValue('categoryId', product.categoryId.toString());

      // Set existing images
      if (product.images && product.images.length > 0) {
        const existingImages: ImageFile[] = product.images.map((img, index) => ({
          file: new File([], `existing-${index}.jpg`, { type: 'image/jpeg' }), // Dummy file with size 0
          preview: img.imageUrl,
          isPrimary: img.isPrimary === true || img.isPrimary === 1
        }));
        setImages(existingImages);
      }
    } else if (mode === 'create' && isOpen) {
      // Reset form for create mode
      reset();
      setImages([]);
    }
  }, [mode, product, isOpen, setValue, reset]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const maxImages = 10; // Giới hạn số lượng ảnh
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    Array.from(files).forEach(file => {
      // Validation số lượng ảnh
      if (images.length >= maxImages) {
        toastError('Lỗi', `Chỉ được tải tối đa ${maxImages} ảnh`);
        return;
      }

      // Validation định dạng file
      if (!allowedTypes.includes(file.type)) {
        toastError('Lỗi', 'Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)');
        return;
      }

      // Validation kích thước file
      if (file.size > maxSize) {
        toastError('Lỗi', 'Kích thước file không được vượt quá 5MB');
        return;
      }

      const preview = URL.createObjectURL(file);
      const newImage: ImageFile = {
        file,
        preview,
        isPrimary: images.length === 0 // First image is primary
      };
      setImages(prev => [...prev, newImage]);
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
    // Validation số lượng ảnh
    if (images.length === 0) {
      toastError('Lỗi', 'Vui lòng thêm ít nhất một ảnh sản phẩm');
      return;
    }

    if (images.length > 10) {
      toastError('Lỗi', 'Chỉ được tải tối đa 10 ảnh');
      return;
    }

    // Validation có ảnh chính không
    const hasPrimaryImage = images.some(img => img.isPrimary);
    if (!hasPrimaryImage) {
      toastError('Lỗi', 'Vui lòng chọn ảnh chính cho sản phẩm');
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

      // Add images with improved structure
      let primaryImageIndex = -1;
      let hasNewImages = false;
      
      images.forEach((image, index) => {
        // Only append actual files (not dummy files for existing images)
        if (image.file && image.file.size > 0) {
          formData.append('images', image.file);
          hasNewImages = true;
        }
        
        if (image.isPrimary) {
          primaryImageIndex = index;
        }
      });
      
      // For edit mode without new images, don't send any files
      // Backend should handle this case by checking hasNewImages flag
      
      // Add primary image index (simpler approach)
      if (primaryImageIndex !== -1) {
        formData.append('primaryImageIndex', primaryImageIndex.toString());
      }
      
      // Add flag to indicate if there are new images
      formData.append('hasNewImages', hasNewImages.toString());
      
      // For edit mode, also send information about existing images
      if (mode === 'edit' && product && product.images) {
        const existingImageIds = product.images.map(img => img.imageId).join(',');
        formData.append('existingImageIds', existingImageIds);
        
        // Send information about which images to keep/delete
        const remainingImageIds = images
          .filter(img => img.preview && img.preview.includes('http')) // Only existing images
          .map((img, index) => {
            // Find the original image ID by matching with product.images
            const originalImg = product.images?.find(pImg => pImg.imageUrl === img.preview);
            return originalImg?.imageId;
          })
          .filter(id => id !== undefined)
          .join(',');
        
        formData.append('remainingImageIds', remainingImageIds);
        console.log('Existing image IDs:', existingImageIds);
        console.log('Remaining image IDs:', remainingImageIds);
      }

      // Debug: Log FormData contents
      console.log('📤 FormData contents:');
      console.log('Mode:', mode);
      console.log('Product ID:', product?.productId);
      console.log('Images count:', images.length);
      console.log('Has new images:', hasNewImages);
      console.log('Primary image index:', primaryImageIndex);
      
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, value.name, `(${value.size} bytes)`);
        } else {
          console.log(`${key}:`, value);
        }
      }

      let response;
      if (mode === 'edit' && product) {
        // Update existing product with images
        response = await adminProductAPI.updateProductWithImages(product.productId, formData);
        toastSuccess('Thành công', 'Đã cập nhật sản phẩm');
      } else {
        // Create new product
        response = await adminProductAPI.createProduct(formData);
        toastSuccess('Thành công', 'Đã thêm sản phẩm mới');
      }
      
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
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'edit' ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h2>
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
                disabled={categoriesLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {categoriesLoading ? 'Đang tải danh mục...' : 'Chọn danh mục'}
                </option>
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
              {categoriesLoading && (
                <div className="mt-1 text-sm text-blue-600 flex items-center">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-1" />
                  Đang tải danh mục...
                </div>
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
              Hình ảnh sản phẩm * (Tối đa 10 ảnh, mỗi ảnh ≤ 5MB)
            </label>
            
            {/* Upload Button */}
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
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
                  <span>{mode === 'edit' ? 'Đang cập nhật...' : 'Đang tạo...'}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{mode === 'edit' ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
