'use client';

import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  Percent,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { useToastSuccess, useToastError } from '@/components/ui/Toast';
import { Voucher, DiscountType } from '@/types/voucher';

export default function AdminVouchers() {
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [viewingVoucher, setViewingVoucher] = useState<Voucher | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingVoucher, setDeletingVoucher] = useState<Voucher | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as DiscountType,
    minOrderValue: '',
    startDate: '',
    endDate: '',
    description: '',
    discountValue: '',
    maxDiscount: '',
    usageLimit: '',
    perUserLimit: '',
    combinable: false,
    isActive: true
  });

  // Fetch vouchers from API
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/vouchers');
        setVouchers(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching vouchers:', err);
        setError('Không thể tải danh sách voucher');
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const getVoucherStatus = (voucher: Voucher) => {
    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);
    
    if (!voucher.isActive || voucher.isDeleted) {
      return 'inactive';
    } else if (now < startDate) {
      return 'scheduled';
    } else if (now > endDate) {
      return 'expired';
    } else {
      return 'active';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'expired':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'expired':
        return 'Hết hạn';
      case 'scheduled':
        return 'Chờ kích hoạt';
      case 'inactive':
        return 'Không hoạt động';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatValue = (voucher: Voucher) => {
    if (voucher.discountType === 'percentage') {
      return `${voucher.discountValue}%`;
    } else if (voucher.discountType === 'fixed') {
      return `${parseFloat(voucher.discountValue || '0').toLocaleString('vi-VN')}₫`;
    } else if (voucher.discountType === 'freeship') {
      return 'Miễn phí ship';
    }
    return 'N/A';
  };

  const getDiscountTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-4 h-4 text-blue-500" />;
      case 'fixed':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'freeship':
        return <Truck className="w-4 h-4 text-purple-500" />;
      default:
        return <Ticket className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDiscountTypeText = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'Giảm giá %';
      case 'fixed':
        return 'Giảm giá cố định';
      case 'freeship':
        return 'Miễn phí ship';
      default:
        return 'Không xác định';
    }
  };

  const filteredVouchers = vouchers.filter(voucher => {
    const status = getVoucherStatus(voucher);
    const matchesSearch = voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.code.trim()) {
      toastError('Vui lòng nhập mã voucher');
      return;
    }
    
    if (formData.discountType !== 'freeship' && !formData.discountValue) {
      toastError('Vui lòng nhập giá trị giảm giá');
      return;
    }
    
    if (!formData.minOrderValue) {
      toastError('Vui lòng nhập đơn hàng tối thiểu');
      return;
    }
    
    if (!formData.startDate || !formData.endDate) {
      toastError('Vui lòng chọn ngày bắt đầu và kết thúc');
      return;
    }
    
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toastError('Ngày kết thúc phải sau ngày bắt đầu');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Prepare data according to API spec
      const submitData: any = {
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        minOrderValue: parseFloat(formData.minOrderValue),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        combinable: formData.combinable,
        isActive: formData.isActive
      };

      // Add description if provided
      if (formData.description.trim()) {
        submitData.description = formData.description.trim();
      }

      // Add discountValue if not freeship
      if (formData.discountType !== 'freeship' && formData.discountValue) {
        submitData.discountValue = parseFloat(formData.discountValue);
      }

      // Add maxDiscount for percentage type
      if (formData.discountType === 'percentage' && formData.maxDiscount) {
        submitData.maxDiscount = parseFloat(formData.maxDiscount);
      }

      // Add usage limits if provided
      if (formData.usageLimit) {
        submitData.usageLimit = parseInt(formData.usageLimit);
      }
      if (formData.perUserLimit) {
        submitData.perUserLimit = parseInt(formData.perUserLimit);
      }

      console.log('Submitting voucher data:', submitData);
      const response = await api.post('/vouchers', submitData);
      console.log('Voucher created successfully:', response.data);
      
      // Refresh vouchers list
      const vouchersResponse = await api.get('/vouchers');
      setVouchers(vouchersResponse.data);
      
      // Reset form and close modal
      resetForm();
      setShowAddModal(false);
      
      // Show success message
      toastSuccess('Tạo voucher thành công!');
      
    } catch (err: any) {
      console.error('Error creating voucher:', err);
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi tạo voucher';
      toastError(`Lỗi: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage' as DiscountType,
      minOrderValue: '',
      startDate: '',
      endDate: '',
      description: '',
      discountValue: '',
      maxDiscount: '',
      usageLimit: '',
      perUserLimit: '',
      combinable: false,
      isActive: true
    });
  };

  // Handle view voucher
  const handleViewVoucher = (voucher: Voucher) => {
    setViewingVoucher(voucher);
    setShowViewModal(true);
  };

  // Handle delete voucher
  const handleDeleteVoucher = (voucher: Voucher) => {
    setDeletingVoucher(voucher);
    setShowDeleteModal(true);
  };

  // Confirm delete voucher
  const confirmDeleteVoucher = async () => {
    if (!deletingVoucher) return;
    
    try {
      setSubmitting(true);
      
      console.log('Deleting voucher:', deletingVoucher.id);
      await api.delete(`/vouchers/${deletingVoucher.id}/hard`);
      console.log('Voucher deleted successfully');
      
      // Refresh vouchers list
      const vouchersResponse = await api.get('/vouchers');
      setVouchers(vouchersResponse.data);
      
      // Show success message
      toastSuccess(`Đã xóa voucher "${deletingVoucher.code}" thành công!`);
      
      // Close modal
      setShowDeleteModal(false);
      setDeletingVoucher(null);
      
    } catch (err: any) {
      console.error('Error deleting voucher:', err);
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi xóa voucher';
      toastError(`Lỗi: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit voucher
  const handleEditVoucher = async (voucherId: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/vouchers/${voucherId}`);
      const voucher = response.data;
      
      setEditingVoucher(voucher);
      
      // Convert API data to form format
      const startDate = new Date(voucher.startDate);
      const endDate = new Date(voucher.endDate);
      
      setFormData({
        code: voucher.code,
        discountType: voucher.discountType as DiscountType,
        minOrderValue: parseFloat(voucher.minOrderValue).toString(),
        startDate: startDate.toISOString().slice(0, 16), // Format for datetime-local input
        endDate: endDate.toISOString().slice(0, 16),
        description: voucher.description || '',
        discountValue: voucher.discountValue ? parseFloat(voucher.discountValue).toString() : '',
        maxDiscount: voucher.maxDiscount ? parseFloat(voucher.maxDiscount).toString() : '',
        usageLimit: voucher.usageLimit ? voucher.usageLimit.toString() : '',
        perUserLimit: voucher.perUserLimit ? voucher.perUserLimit.toString() : '',
        combinable: voucher.combinable,
        isActive: voucher.isActive
      });
      
      setShowEditModal(true);
    } catch (err) {
      console.error('Error fetching voucher:', err);
      toastError('Không thể tải thông tin voucher');
    } finally {
      setLoading(false);
    }
  };

  // Handle update voucher
  const handleUpdateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingVoucher) return;
    
    // Validation (same as create)
    if (!formData.code.trim()) {
      toastError('Vui lòng nhập mã voucher');
      return;
    }
    
    if (formData.discountType !== 'freeship' && !formData.discountValue) {
      toastError('Vui lòng nhập giá trị giảm giá');
      return;
    }
    
    if (!formData.minOrderValue) {
      toastError('Vui lòng nhập đơn hàng tối thiểu');
      return;
    }
    
    if (!formData.startDate || !formData.endDate) {
      toastError('Vui lòng chọn ngày bắt đầu và kết thúc');
      return;
    }
    
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toastError('Ngày kết thúc phải sau ngày bắt đầu');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Prepare data according to API spec
      const submitData: any = {
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        minOrderValue: parseFloat(formData.minOrderValue),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        combinable: formData.combinable,
        isActive: formData.isActive
      };

      // Add description if provided
      if (formData.description.trim()) {
        submitData.description = formData.description.trim();
      }

      // Add discountValue if not freeship
      if (formData.discountType !== 'freeship' && formData.discountValue) {
        submitData.discountValue = parseFloat(formData.discountValue);
      }

      // Add maxDiscount for percentage type
      if (formData.discountType === 'percentage' && formData.maxDiscount) {
        submitData.maxDiscount = parseFloat(formData.maxDiscount);
      }

      // Add usage limits if provided
      if (formData.usageLimit) {
        submitData.usageLimit = parseInt(formData.usageLimit);
      }
      if (formData.perUserLimit) {
        submitData.perUserLimit = parseInt(formData.perUserLimit);
      }

      console.log('Updating voucher data:', submitData);
      const response = await api.put(`/vouchers/${editingVoucher.id}`, submitData);
      console.log('Voucher updated successfully:', response.data);
      
      // Refresh vouchers list
      const vouchersResponse = await api.get('/vouchers');
      setVouchers(vouchersResponse.data);
      
      // Reset form and close modal
      resetForm();
      setShowEditModal(false);
      setEditingVoucher(null);
      
      // Show success message
      toastSuccess('Cập nhật voucher thành công!');
      
    } catch (err: any) {
      console.error('Error updating voucher:', err);
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật voucher';
      toastError(`Lỗi: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-red-500" />
          <span className="text-gray-600">Đang tải danh sách voucher...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <Ticket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Voucher</h1>
            <p className="text-gray-600 text-sm">Tạo và quản lý các mã giảm giá</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo voucher mới</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng voucher</p>
              <p className="text-2xl font-bold text-gray-900">{vouchers.length}</p>
            </div>
            <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center">
              <Ticket className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
              <p className="text-2xl font-bold text-green-600">
                {vouchers.filter(v => getVoucherStatus(v) === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hết hạn</p>
              <p className="text-2xl font-bold text-red-600">
                {vouchers.filter(v => getVoucherStatus(v) === 'expired').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã sử dụng</p>
              <p className="text-2xl font-bold text-blue-600">
                {vouchers.reduce((sum, v) => sum + v.usedCount, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm voucher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="expired">Hết hạn</option>
              <option value="scheduled">Chờ kích hoạt</option>
              <option value="inactive">Không hoạt động</option>
            </select>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center space-x-2 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Lọc</span>
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center space-x-2 transition-colors">
              <Download className="w-4 h-4" />
              <span>Xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">MÃ VOUCHER</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">LOẠI</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">GIÁ TRỊ</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">ĐIỀU KIỆN</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">MÔ TẢ</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">TRẠNG THÁI</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">SỬ DỤNG</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">HẾT HẠN</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredVouchers.map((voucher) => {
                const status = getVoucherStatus(voucher);
                return (
                  <tr key={voucher.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Ticket className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{voucher.code}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getDiscountTypeIcon(voucher.discountType)}
                        <span className="text-gray-600 text-sm">
                          {getDiscountTypeText(voucher.discountType)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">
                        {formatValue(voucher)}
                      </span>
                      {voucher.maxDiscount && (
                        <div className="text-xs text-gray-500">
                          Tối đa: {parseFloat(voucher.maxDiscount).toLocaleString('vi-VN')}₫
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">
                        <div>Đơn tối thiểu: {parseFloat(voucher.minOrderValue).toLocaleString('vi-VN')}₫</div>
                        {voucher.perUserLimit && (
                          <div>Giới hạn: {voucher.perUserLimit} lần/người</div>
                        )}
                        <div className="flex items-center space-x-1 mt-1">
                          <span className={`text-xs px-2 py-1 rounded ${
                            voucher.combinable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {voucher.combinable ? 'Có thể kết hợp' : 'Không kết hợp'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600 text-sm max-w-xs truncate">
                        {voucher.description}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {getStatusText(status)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <span className="text-gray-900">{voucher.usedCount}</span>
                        <span className="text-gray-500">/{voucher.usageLimit}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 text-sm">
                          {formatDate(voucher.endDate)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewVoucher(voucher)}
                        className="text-blue-600 hover:text-blue-700 p-1" 
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditVoucher(voucher.id)}
                        className="text-green-600 hover:text-green-700 p-1" 
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                        <button 
                          onClick={() => handleDeleteVoucher(voucher)}
                          className="text-red-600 hover:text-red-700 p-1" 
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredVouchers.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy voucher nào</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Hiển thị {filteredVouchers.length} trong tổng số {vouchers.length} voucher
        </p>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
            Trước
          </button>
          <button className="px-3 py-1 text-sm bg-red-500 text-white rounded">
            1
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
            Sau
          </button>
        </div>
      </div>

      {/* Add Voucher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Tạo voucher mới</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã voucher <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Nhập mã voucher (1-50 ký tự)"
                  />
                </div>

                {/* Discount Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại giảm giá <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value as DiscountType})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="percentage">Giảm giá phần trăm</option>
                    <option value="fixed">Giảm giá cố định</option>
                    <option value="freeship">Miễn phí ship</option>
                  </select>
                </div>

                {/* Discount Value */}
                {(formData.discountType as DiscountType) !== 'freeship' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá trị giảm giá <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        required
                        min="0"
                        step={formData.discountType === 'percentage' ? '0.01' : '1'}
                        value={formData.discountValue}
                        onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder={formData.discountType === 'percentage' ? '20' : '50000'}
                      />
                      <span className="text-gray-500">
                        {formData.discountType === 'percentage' ? '%' : '₫'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Max Discount (only for percentage) */}
                {formData.discountType === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giảm giá tối đa
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="50000"
                      />
                      <span className="text-gray-500">₫</span>
                    </div>
                  </div>
                )}

                {/* Min Order Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đơn hàng tối thiểu <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      required
                      min="0"
                      step="1"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({...formData, minOrderValue: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="100000"
                    />
                    <span className="text-gray-500">₫</span>
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày bắt đầu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày kết thúc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Usage Limits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới hạn sử dụng tổng
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="1000 (để trống = không giới hạn)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới hạn sử dụng/người
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formData.perUserLimit}
                      onChange={(e) => setFormData({...formData, perUserLimit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="1 (để trống = không giới hạn)"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    maxLength={255}
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    placeholder="Mô tả voucher (tối đa 255 ký tự)"
                  />
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="combinable"
                      checked={formData.combinable}
                      onChange={(e) => setFormData({...formData, combinable: e.target.checked})}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="combinable" className="ml-2 text-sm text-gray-700">
                      Có thể kết hợp với voucher khác
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Kích hoạt ngay sau khi tạo
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang tạo...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Tạo voucher</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Voucher Modal */}
      {showEditModal && editingVoucher && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Chỉnh sửa voucher</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingVoucher(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateVoucher} className="space-y-4">
                {/* Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã voucher <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Nhập mã voucher (1-50 ký tự)"
                  />
                </div>

                {/* Discount Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại giảm giá <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value as DiscountType})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="percentage">Giảm giá phần trăm</option>
                    <option value="fixed">Giảm giá cố định</option>
                    <option value="freeship">Miễn phí ship</option>
                  </select>
                </div>

                {/* Discount Value */}
                {(formData.discountType as DiscountType) !== 'freeship' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá trị giảm giá <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        required
                        min="0"
                        step={formData.discountType === 'percentage' ? '0.01' : '1'}
                        value={formData.discountValue}
                        onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder={formData.discountType === 'percentage' ? '20' : '50000'}
                      />
                      <span className="text-gray-500">
                        {formData.discountType === 'percentage' ? '%' : '₫'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Max Discount (only for percentage) */}
                {formData.discountType === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giảm giá tối đa
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="50000"
                      />
                      <span className="text-gray-500">₫</span>
                    </div>
                  </div>
                )}

                {/* Min Order Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đơn hàng tối thiểu <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      required
                      min="0"
                      step="1"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({...formData, minOrderValue: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="100000"
                    />
                    <span className="text-gray-500">₫</span>
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày bắt đầu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày kết thúc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Usage Limits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới hạn sử dụng tổng
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="1000 (để trống = không giới hạn)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới hạn sử dụng/người
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formData.perUserLimit}
                      onChange={(e) => setFormData({...formData, perUserLimit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="1 (để trống = không giới hạn)"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    maxLength={255}
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    placeholder="Mô tả voucher (tối đa 255 ký tự)"
                  />
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="edit-combinable"
                      checked={formData.combinable}
                      onChange={(e) => setFormData({...formData, combinable: e.target.checked})}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="edit-combinable" className="ml-2 text-sm text-gray-700">
                      Có thể kết hợp với voucher khác
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="edit-isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="edit-isActive" className="ml-2 text-sm text-gray-700">
                      Kích hoạt voucher
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingVoucher(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang cập nhật...</span>
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4" />
                        <span>Cập nhật voucher</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingVoucher && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Xác nhận xóa</h2>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingVoucher(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-gray-700 text-lg">
                  Bạn có chắc muốn xóa voucher này?
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingVoucher(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  disabled={submitting}
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDeleteVoucher}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Voucher Modal */}
      {showViewModal && viewingVoucher && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Xem voucher</h2>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewingVoucher(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Voucher Card */}
              <div className="relative">
                {/* Voucher Design */}
                <div className={`relative overflow-hidden rounded-xl shadow-lg ${
                  getVoucherStatus(viewingVoucher) === 'active' 
                    ? 'bg-gradient-to-r from-green-500 to-green-600' 
                    : 'bg-gradient-to-r from-gray-400 to-gray-500'
                }`}>
                  {/* Left Section */}
                  <div className="flex">
                    <div className={`w-32 p-4 flex flex-col justify-center items-center ${
                      getVoucherStatus(viewingVoucher) === 'active' 
                        ? 'bg-green-600' 
                        : 'bg-gray-500'
                    }`}>
                      <div className="text-white text-center">
                        <div className="text-lg font-bold uppercase tracking-wider">DISCOUNT</div>
                        <div className="text-xs font-medium uppercase mt-1">HCMUTE GIFT SHOP</div>
                      </div>
                    </div>

                    {/* Perforated Line */}
                    <div className="flex flex-col justify-center">
                      <div className="w-0.5 h-16 bg-white/30 flex flex-col">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="w-1 h-1 bg-white/50 rounded-full mx-[-2px] mt-1"></div>
                        ))}
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex-1 bg-white p-4">
                      <div className="space-y-2">
                        {/* Discount Value */}
                        <div className="text-gray-600 text-sm">
                          Giảm tối đa <span className="underline font-semibold">
                            {viewingVoucher.maxDiscount 
                              ? `${parseFloat(viewingVoucher.maxDiscount).toLocaleString('vi-VN')} ₫`
                              : formatValue(viewingVoucher)
                            }
                          </span>
                        </div>

                        {/* Usage Badge */}
                        <div className="flex justify-between items-center">
                          <div className="text-gray-500 text-xs">
                            Đơn tối thiểu <span className="underline">
                              {parseFloat(viewingVoucher.minOrderValue).toLocaleString('vi-VN')} ₫
                            </span>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            getVoucherStatus(viewingVoucher) === 'active'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            x {viewingVoucher.usageLimit || '∞'}
                          </div>
                        </div>

                        {/* Expiry Info */}
                        <div className="flex justify-between items-center text-xs">
                          <div className={`${
                            getVoucherStatus(viewingVoucher) === 'active' ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {(() => {
                              const endDate = new Date(viewingVoucher.endDate);
                              const now = new Date();
                              const diffTime = endDate.getTime() - now.getTime();
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                              
                              if (diffDays > 0) {
                                return `Còn ${diffDays} ngày`;
                              } else if (diffDays === 0) {
                                return 'Hết hạn hôm nay';
                              } else {
                                return 'Đã hết hạn';
                              }
                            })()}
                          </div>
                          <div className={`${
                            getVoucherStatus(viewingVoucher) === 'active' ? 'text-blue-600' : 'text-gray-400'
                          } cursor-pointer hover:underline`}>
                            Điều kiện
                          </div>
                        </div>

                        {/* Selection Circle */}
                        <div className="flex justify-end">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            getVoucherStatus(viewingVoucher) === 'active'
                              ? 'border-gray-300'
                              : 'border-gray-200'
                          }`}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Info Banner */}
                <div className={`mt-2 p-3 rounded-lg flex items-center space-x-2 ${
                  getVoucherStatus(viewingVoucher) === 'active'
                    ? 'bg-orange-100'
                    : 'bg-gray-100'
                }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    getVoucherStatus(viewingVoucher) === 'active'
                      ? 'bg-orange-500'
                      : 'bg-gray-400'
                  }`}>
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <span className={`text-sm ${
                    getVoucherStatus(viewingVoucher) === 'active' ? 'text-orange-700' : 'text-gray-500'
                  }`}>
                    Đơn hàng tối thiểu <span className="underline">
                      {parseFloat(viewingVoucher.minOrderValue).toLocaleString('vi-VN')} ₫
                    </span>
                  </span>
                </div>

                {/* Voucher Code */}
                <div className="mt-4 text-center">
                  <div className={`text-2xl font-bold tracking-wider ${
                    getVoucherStatus(viewingVoucher) === 'active' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {viewingVoucher.code}
                  </div>
                  {viewingVoucher.description && (
                    <div className="text-sm text-gray-600 mt-1">
                      {viewingVoucher.description}
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="mt-4 flex justify-center">
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                    getVoucherStatus(viewingVoucher) === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getStatusText(getVoucherStatus(viewingVoucher))}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewingVoucher(null);
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
