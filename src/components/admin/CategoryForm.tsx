'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  X, 
  AlertCircle,
  FolderOpen,
  FileText
} from 'lucide-react';
import { adminCategoryAPI } from '@/lib/api';
import { useToastSuccess, useToastError } from '@/components/ui/Toast';
import { Category } from '@/types/api';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: Category | null;
  mode?: 'create' | 'edit';
}

interface CategoryFormData {
  categoryName: string;
  description: string;
}

const schema = yup.object({
  categoryName: yup.string().required('Tên danh mục là bắt buộc').min(2, 'Tên danh mục phải có ít nhất 2 ký tự'),
  description: yup.string().required('Mô tả danh mục là bắt buộc').min(10, 'Mô tả phải có ít nhất 10 ký tự'),
});

export default function CategoryForm({ isOpen, onClose, onSuccess, category, mode = 'create' }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CategoryFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      categoryName: '',
      description: '',
    }
  });

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && category && isOpen) {
      setValue('categoryName', category.categoryName);
      setValue('description', category.description || '');
    } else if (mode === 'create' && isOpen) {
      reset();
    }
  }, [mode, category, isOpen, setValue, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setLoading(true);
      
      let response;
      if (mode === 'edit' && category) {
        // Update existing category
        response = await adminCategoryAPI.updateCategory(category.categoryId, data);
        toastSuccess('Thành công', 'Đã cập nhật danh mục');
      } else {
        // Create new category
        response = await adminCategoryAPI.createCategory(data);
        toastSuccess('Thành công', 'Đã thêm danh mục mới');
      }
      
      handleClose();
      onSuccess();
      
    } catch (error: any) {
      console.error('❌ Error saving category:', error);
      const action = mode === 'edit' ? 'cập nhật' : 'tạo';
      toastError('Lỗi', error.response?.data?.message || `Không thể ${action} danh mục`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FolderOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'edit' ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FolderOpen className="w-4 h-4 inline mr-2" />
              Tên danh mục *
            </label>
            <input
              {...register('categoryName')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tên danh mục"
            />
            {errors.categoryName && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.categoryName.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Mô tả danh mục *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập mô tả chi tiết về danh mục"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Xem trước:</h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {watch('categoryName') || 'Tên danh mục'}
                </div>
                <div className="text-sm text-gray-500">
                  {watch('description') || 'Mô tả danh mục'}
                </div>
              </div>
            </div>
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
                  <FolderOpen className="w-4 h-4" />
                  <span>{mode === 'edit' ? 'Cập nhật danh mục' : 'Tạo danh mục'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
