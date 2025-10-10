'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  ShoppingCart
} from 'lucide-react';

export default function AdminReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('sales');

  // Mock data
  const reportData = {
    sales: {
      title: 'Báo cáo doanh thu',
      total: '125,450,000₫',
      change: '+15.2%',
      changeType: 'positive',
      data: [
        { period: 'Tháng 1', value: 85000000 },
        { period: 'Tháng 2', value: 92000000 },
        { period: 'Tháng 3', value: 105000000 },
        { period: 'Tháng 4', value: 125450000 }
      ]
    },
    users: {
      title: 'Báo cáo người dùng',
      total: '2,847',
      change: '+8.5%',
      changeType: 'positive',
      data: [
        { period: 'Tháng 1', value: 2100 },
        { period: 'Tháng 2', value: 2350 },
        { period: 'Tháng 3', value: 2650 },
        { period: 'Tháng 4', value: 2847 }
      ]
    },
    products: {
      title: 'Báo cáo sản phẩm',
      total: '1,234',
      change: '+12.3%',
      changeType: 'positive',
      data: [
        { period: 'Tháng 1', value: 950 },
        { period: 'Tháng 2', value: 1050 },
        { period: 'Tháng 3', value: 1150 },
        { period: 'Tháng 4', value: 1234 }
      ]
    },
    orders: {
      title: 'Báo cáo đơn hàng',
      total: '856',
      change: '+18.7%',
      changeType: 'positive',
      data: [
        { period: 'Tháng 1', value: 650 },
        { period: 'Tháng 2', value: 720 },
        { period: 'Tháng 3', value: 780 },
        { period: 'Tháng 4', value: 856 }
      ]
    }
  };

  const currentReport = reportData[selectedReport as keyof typeof reportData];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-8 h-8 text-gray-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Báo cáo thống kê</h1>
            <p className="text-gray-600 text-sm">Xem và phân tích dữ liệu hệ thống</p>
          </div>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Xuất báo cáo</span>
        </button>
      </div>

      {/* Report Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Loại báo cáo:</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="sales">Doanh thu</option>
              <option value="users">Người dùng</option>
              <option value="products">Sản phẩm</option>
              <option value="orders">Đơn hàng</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Thời gian:</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="quarter">Quý</option>
              <option value="year">Năm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{currentReport.title}</p>
              <p className="text-2xl font-bold text-gray-900">{currentReport.total}</p>
              <div className={`flex items-center text-sm mt-1 ${
                currentReport.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {currentReport.changeType === 'positive' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {currentReport.change} so với kỳ trước
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">45,678,000₫</p>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +23% so với tháng trước
              </div>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">856</p>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +15% so với tháng trước
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">{currentReport.title}</h2>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Cập nhật lần cuối: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
        
        {/* Chart Placeholder */}
        <div className="h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600 font-medium">Biểu đồ {currentReport.title.toLowerCase()}</p>
            <p className="text-sm text-gray-500">Dữ liệu sẽ được hiển thị tại đây</p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Dữ liệu chi tiết</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá trị
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thay đổi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tỷ lệ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentReport.data.map((item, index) => {
                const prevValue = index > 0 ? currentReport.data[index - 1].value : item.value;
                const change = item.value - prevValue;
                const changePercent = prevValue > 0 ? ((change / prevValue) * 100).toFixed(1) : 0;
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {selectedReport === 'sales' ? 
                        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.value) :
                        item.value.toLocaleString()
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {selectedReport === 'sales' ? 
                        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(change) :
                        change.toLocaleString()
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {change >= 0 ? '+' : ''}{changePercent}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
