'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  UserPlus,
  Download,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { adminCustomerAPI } from '@/lib/api';
import { Customer, CustomersResponse } from '@/types/user';
import { useToastSuccess, useToastError } from '@/components/ui/Toast';

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Fetching customers from API...');
        
        const response = await adminCustomerAPI.getAllCustomers();
        console.log('✅ Customers API response:', response.data);
        
        if (response.data && response.data.customers) {
          setCustomers(response.data.customers);
          console.log('✅ Customers loaded:', response.data.customers.length);
        } else {
          console.warn('⚠️ No customers data in response');
          setCustomers([]);
        }
      } catch (error: any) {
        console.error('❌ Error fetching customers:', error);
        setError(error.response?.data?.message || 'Không thể tải danh sách khách hàng');
        toastError('Lỗi', 'Không thể tải danh sách khách hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []); // Empty dependency array - chỉ chạy một lần khi component mount

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'customer': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-green-100 text-green-800';
      case 'vendor': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'customer': return 'Khách hàng';
      case 'staff': return 'Nhân viên';
      case 'vendor': return 'Nhà cung cấp';
      case 'admin': return 'Quản trị viên';
      default: return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Hoạt động' : 'Không hoạt động';
  };

  const getVerificationText = (isVerified: boolean) => {
    return isVerified ? 'Đã xác thực' : 'Chưa xác thực';
  };

  const getVerificationColor = (isVerified: boolean) => {
    return isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getFullName = (customer: Customer) => {
    return `${customer.firstName} ${customer.lastName}`;
  };

  const filteredCustomers = customers.filter(customer => {
    const fullName = getFullName(customer);
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (selectedRole === 'active') {
      matchesFilter = customer.isActive;
    } else if (selectedRole === 'inactive') {
      matchesFilter = !customer.isActive;
    } else if (selectedRole === 'verified') {
      matchesFilter = customer.isVerified;
    } else if (selectedRole === 'unverified') {
      matchesFilter = !customer.isVerified;
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminCustomerAPI.getAllCustomers();
      if (response.data && response.data.customers) {
        setCustomers(response.data.customers);
        toastSuccess('Thành công', 'Đã làm mới danh sách khách hàng');
      }
    } catch (error: any) {
      console.error('❌ Error refreshing customers:', error);
      toastError('Lỗi', 'Không thể làm mới danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (customerId: number) => {
    try {
      await adminCustomerAPI.toggleCustomerActive(customerId);
      
      // Update local state instead of calling API again
      setCustomers(prevCustomers => 
        prevCustomers.map(customer => 
          customer.id === customerId 
            ? { ...customer, isActive: !customer.isActive }
            : customer
        )
      );
      
      toastSuccess('Thành công', 'Đã cập nhật trạng thái khách hàng');
    } catch (error: any) {
      console.error('❌ Error toggling customer active:', error);
      toastError('Lỗi', 'Không thể cập nhật trạng thái khách hàng');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-gray-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý khách hàng</h1>
            <p className="text-gray-600 text-sm">Quản lý thông tin và trạng thái khách hàng</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <UserPlus className="w-4 h-4" />
            <span>Thêm khách hàng</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng khách hàng</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Khách hàng hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">{customers.filter(c => c.isActive).length}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã xác thực</p>
              <p className="text-2xl font-bold text-gray-900">{customers.filter(c => c.isVerified).length}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chưa xác thực</p>
              <p className="text-2xl font-bold text-gray-900">{customers.filter(c => !c.isVerified).length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="verified">Đã xác thực</option>
              <option value="unverified">Chưa xác thực</option>
            </select>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Lọc</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span>Xuất file</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div>
            <p className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Đang tải danh sách khách hàng...</span>
          </div>
        </div>
      )}

      {/* Customers Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Xác thực
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Không tìm thấy khách hàng nào
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {getFullName(customer)}
                            </div>
                            <div className="text-sm text-gray-500">ID: {customer.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.email}</div>
                        <div className="text-sm text-gray-500">
                          {customer.phone || 'Chưa có số điện thoại'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.isActive)}`}>
                          {getStatusText(customer.isActive)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVerificationColor(customer.isVerified)}`}>
                          {getVerificationText(customer.isVerified)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(customer.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleToggleActive(customer.id)}
                            className={`px-3 py-1 text-xs rounded-full ${
                              customer.isActive 
                                ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                            title={customer.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                          >
                            {customer.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                          </button>
                          <button className="text-gray-400 hover:text-gray-600" title="Xem chi tiết">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600" title="Chỉnh sửa">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600" title="Xóa">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
