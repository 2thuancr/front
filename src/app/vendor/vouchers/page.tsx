'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Calendar,
  Percent,
  Users,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { voucherAPI } from '@/lib/api';
import { Voucher, CreateVoucherData } from '@/types/voucher';

// Voucher status configuration
const statusConfig = {
  active: { label: 'Hoạt động', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  inactive: { label: 'Không hoạt động', color: 'bg-gray-100 text-gray-800', icon: XCircle },
  expired: { label: 'Hết hạn', color: 'bg-red-100 text-red-800', icon: XCircle },
  scheduled: { label: 'Đã lên lịch', color: 'bg-blue-100 text-blue-800', icon: Clock },
};

// Voucher type configuration
const typeConfig = {
  percentage: { label: 'Giảm theo %', color: 'bg-purple-100 text-purple-800', icon: Percent },
  fixed: { label: 'Giảm số tiền', color: 'bg-orange-100 text-orange-800', icon: Ticket },
  freeship: { label: 'Miễn phí ship', color: 'bg-blue-100 text-blue-800', icon: Users },
};

export default function VendorVouchers() {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalVouchers, setTotalVouchers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState<CreateVoucherData>({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    startDate: '',
    endDate: '',
    usageLimit: 100,
    perUserLimit: 1,
    combinable: false
  });

  useEffect(() => {
    loadVouchers();
  }, [currentPage, selectedStatus, selectedType]);

  const loadVouchers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call API to get vouchers
      const response = await voucherAPI.getAll();
      let allVouchers = response.data || [];
      
      // Filter by search term
      if (searchTerm) {
        allVouchers = allVouchers.filter((voucher: Voucher) =>
          voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          voucher.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Filter by status
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'active') {
          allVouchers = allVouchers.filter((voucher: Voucher) => voucher.isActive);
        } else if (selectedStatus === 'inactive') {
          allVouchers = allVouchers.filter((voucher: Voucher) => !voucher.isActive);
        } else if (selectedStatus === 'expired') {
          allVouchers = allVouchers.filter((voucher: Voucher) => 
            new Date(voucher.endDate) < new Date()
          );
        }
      }
      
      // Filter by type
      if (selectedType !== 'all') {
        allVouchers = allVouchers.filter((voucher: Voucher) => voucher.discountType === selectedType);
      }
      
      setVouchers(allVouchers);
      setTotalVouchers(allVouchers.length);
    } catch (err: any) {
      setError('Không thể tải danh sách voucher');
      console.error('Error loading vouchers:', err);
      addToast({ type: 'error', title: 'Không thể tải danh sách voucher' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadVouchers();
  };

  const handleRefresh = () => {
    loadVouchers();
  };

  const handleDeleteVoucher = async (voucherId: number) => {
    try {
      await voucherAPI.delete(voucherId);
      
      setVouchers(prev => prev.filter(v => v.id !== voucherId));
      setShowDeleteModal(false);
      setSelectedVoucher(null);
      addToast({ type: 'success', title: 'Xóa voucher thành công' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Không thể xóa voucher' });
      console.error('Error deleting voucher:', err);
    }
  };

  const handleCreateVoucher = async () => {
    try {
      setCreateLoading(true);
      
      // Validate form data
      if (!formData.code || !formData.description || !formData.startDate || !formData.endDate) {
        addToast({ type: 'error', title: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
        return;
      }

      if (formData.discountType !== 'freeship' && (!formData.discountValue || formData.discountValue <= 0)) {
        addToast({ type: 'error', title: 'Vui lòng nhập giá trị giảm giá hợp lệ' });
        return;
      }

      if (formData.discountType !== 'freeship' && !formData.usageLimit) {
        addToast({ type: 'error', title: 'Vui lòng nhập giới hạn sử dụng' });
        return;
      }

      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        addToast({ type: 'error', title: 'Ngày kết thúc phải sau ngày bắt đầu' });
        return;
      }

      // Prepare data for API according to backend format
      const createData: any = {
        code: formData.code,
        description: formData.description,
        discountType: formData.discountType,
        minOrderValue: formData.minOrderValue,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        usageLimit: formData.usageLimit,
        perUserLimit: formData.perUserLimit || null,
        combinable: formData.combinable,
        isActive: true
      };

      // Add discount value only if not freeship
      if (formData.discountType !== 'freeship') {
        createData.discountValue = formData.discountValue;
      }

      // Add max discount only for percentage type
      if (formData.discountType === 'percentage' && formData.maxDiscount > 0) {
        createData.maxDiscount = formData.maxDiscount;
      }

      // Set usageLimit to null for freeship if not specified
      if (formData.discountType === 'freeship') {
        createData.usageLimit = formData.usageLimit || null;
      }

      console.log('Creating voucher with data:', createData);
      const response = await voucherAPI.create(createData);
      
      // Add new voucher to list
      setVouchers(prev => [response.data, ...prev]);
      setTotalVouchers(prev => prev + 1);
      
      // Reset form and close modal
      resetForm();
      setShowCreateModal(false);
      addToast({ type: 'success', title: 'Tạo voucher thành công' });
    } catch (err: any) {
      console.error('Error creating voucher:', err);
      const errorMessage = err.response?.data?.message || 'Không thể tạo voucher';
      addToast({ type: 'error', title: errorMessage });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleFormChange = (field: keyof CreateVoucherData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      minOrderValue: 0,
      maxDiscount: 0,
      startDate: '',
      endDate: '',
      usageLimit: 100,
      perUserLimit: 1,
      combinable: false
    });
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusConfig = (voucher: Voucher) => {
    const now = new Date();
    const endDate = new Date(voucher.endDate);
    
    if (!voucher.isActive) {
      return statusConfig.inactive;
    } else if (endDate < now) {
      return statusConfig.expired;
    } else {
      return statusConfig.active;
    }
  };

  const getTypeConfig = (type: string) => {
    return typeConfig[type as keyof typeof typeConfig] || typeConfig.fixed;
  };

  const totalPages = Math.ceil(totalVouchers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVouchers = vouchers.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Voucher</h1>
          <p className="text-gray-600">Tạo và quản lý các mã giảm giá cho cửa hàng</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tạo voucher mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Ticket className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng voucher</p>
              <p className="text-2xl font-bold text-gray-900">{totalVouchers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">
                {vouchers.filter(v => v.isActive && new Date(v.endDate) >= new Date()).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã sử dụng</p>
              <p className="text-2xl font-bold text-gray-900">
                {vouchers.reduce((sum, v) => sum + v.usedCount, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hết hạn</p>
              <p className="text-2xl font-bold text-gray-900">
                {vouchers.filter(v => new Date(v.endDate) < new Date()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã hoặc tên voucher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="expired">Hết hạn</option>
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả loại</option>
              <option value="percentage">Giảm theo %</option>
              <option value="fixed">Giảm số tiền</option>
              <option value="freeship">Miễn phí ship</option>
            </select>
            
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Đang tải danh sách voucher...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-8 h-8 mx-auto text-red-400 mb-4" />
            <p className="text-red-600">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : currentVouchers.length === 0 ? (
          <div className="p-8 text-center">
            <Ticket className="w-8 h-8 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Không có voucher nào</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tạo voucher đầu tiên
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã voucher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên voucher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá trị
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sử dụng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hạn sử dụng
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentVouchers.map((voucher) => {
                    const statusConfig = getStatusConfig(voucher);
                    const typeConfig = getTypeConfig(voucher.discountType);
                    
                    return (
                      <tr key={voucher.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Ticket className="w-4 h-4 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {voucher.code}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {voucher.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            Đơn tối thiểu: {formatCurrency(voucher.minOrderValue)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig.color}`}>
                            <typeConfig.icon className="w-3 h-3 mr-1" />
                            {typeConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {voucher.discountType === 'percentage' ? (
                            `${voucher.discountValue}%`
                          ) : voucher.discountType === 'fixed' ? (
                            formatCurrency(voucher.discountValue || 0)
                          ) : (
                            'Miễn phí'
                          )}
                          {voucher.maxDiscount && voucher.discountType === 'percentage' && (
                            <div className="text-xs text-gray-500">
                              Tối đa: {formatCurrency(voucher.maxDiscount)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {voucher.usedCount}/{voucher.usageLimit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            <statusConfig.icon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(voucher.endDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setSelectedVoucher(voucher)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedVoucher(voucher)}
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedVoucher(voucher);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-900 p-1 rounded"
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Hiển thị <span className="font-medium">{startIndex + 1}</span> đến{' '}
                      <span className="font-medium">{Math.min(endIndex, totalVouchers)}</span> trong{' '}
                      <span className="font-medium">{totalVouchers}</span> kết quả
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Voucher Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Tạo voucher mới</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã voucher *
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => handleFormChange('code', e.target.value)}
                      placeholder="VD: SALE10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại giảm giá *
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => handleFormChange('discountType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="percentage">Giảm theo %</option>
                      <option value="fixed">Giảm số tiền</option>
                      <option value="freeship">Miễn phí ship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả voucher *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    placeholder="Mô tả chi tiết về voucher..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Discount Value */}
                {formData.discountType !== 'freeship' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {formData.discountType === 'percentage' ? 'Phần trăm giảm (%) *' : 'Số tiền giảm (VNĐ) *'}
                      </label>
                      <input
                        type="number"
                        value={formData.discountValue}
                        onChange={(e) => handleFormChange('discountValue', parseFloat(e.target.value) || 0)}
                        placeholder={formData.discountType === 'percentage' ? '10' : '50000'}
                        min="0"
                        step={formData.discountType === 'percentage' ? '0.01' : '1000'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.discountType === 'percentage' && (
                        <p className="text-xs text-gray-500 mt-1">
                          Ví dụ: 10 = giảm 10%
                        </p>
                      )}
                    </div>
                    
                    {formData.discountType === 'percentage' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giảm tối đa (VNĐ)
                        </label>
                        <input
                          type="number"
                          value={formData.maxDiscount}
                          onChange={(e) => handleFormChange('maxDiscount', parseFloat(e.target.value) || 0)}
                          placeholder="50000"
                          min="0"
                          step="1000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Giới hạn số tiền giảm tối đa
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Freeship Info */}
                {formData.discountType === 'freeship' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-blue-600 mr-2" />
                      <h4 className="text-sm font-medium text-blue-800">Voucher miễn phí vận chuyển</h4>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Voucher này sẽ miễn phí vận chuyển cho đơn hàng đạt giá trị tối thiểu.
                    </p>
                  </div>
                )}

                {/* Order Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đơn hàng tối thiểu (VNĐ) *
                    </label>
                    <input
                      type="number"
                      value={formData.minOrderValue}
                      onChange={(e) => handleFormChange('minOrderValue', parseFloat(e.target.value) || 0)}
                      placeholder="100000"
                      min="0"
                      step="1000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới hạn sử dụng {formData.discountType === 'freeship' ? '' : '*'}
                    </label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => handleFormChange('usageLimit', parseInt(e.target.value) || 0)}
                      placeholder={formData.discountType === 'freeship' ? 'Không giới hạn (để trống)' : '100'}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.discountType === 'freeship' && (
                      <p className="text-xs text-gray-500 mt-1">
                        Để trống nếu không muốn giới hạn số lần sử dụng
                      </p>
                    )}
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày bắt đầu *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => handleFormChange('startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày kết thúc *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => handleFormChange('endDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Additional Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới hạn mỗi người dùng
                    </label>
                    <input
                      type="number"
                      value={formData.perUserLimit}
                      onChange={(e) => handleFormChange('perUserLimit', parseInt(e.target.value) || 1)}
                      placeholder="1"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="combinable"
                      checked={formData.combinable}
                      onChange={(e) => handleFormChange('combinable', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="combinable" className="ml-2 block text-sm text-gray-700">
                      Có thể kết hợp với voucher khác
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateVoucher}
                  disabled={createLoading}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {createLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Tạo voucher
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedVoucher && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-2">Xác nhận xóa</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Bạn có chắc chắn muốn xóa voucher <strong>{selectedVoucher.code}</strong>?
                  Hành động này không thể hoàn tác.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => handleDeleteVoucher(selectedVoucher.id)}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Xóa
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedVoucher(null);
                  }}
                  className="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
