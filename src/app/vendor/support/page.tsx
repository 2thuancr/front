'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Send,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Video,
  BookOpen
} from 'lucide-react';

export default function VendorSupportPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tickets');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with real API calls
  const tickets = [
    {
      id: 'TKT-001',
      subject: 'Vấn đề với thanh toán đơn hàng',
      category: 'Thanh toán',
      priority: 'high',
      status: 'open',
      createdAt: '2024-01-15T10:30:00Z',
      lastUpdate: '2024-01-15T14:20:00Z',
      messages: 3
    },
    {
      id: 'TKT-002',
      subject: 'Hướng dẫn tạo sản phẩm mới',
      category: 'Hướng dẫn',
      priority: 'medium',
      status: 'in_progress',
      createdAt: '2024-01-14T09:15:00Z',
      lastUpdate: '2024-01-15T11:30:00Z',
      messages: 5
    },
    {
      id: 'TKT-003',
      subject: 'Lỗi hiển thị trên trang quản lý',
      category: 'Kỹ thuật',
      priority: 'low',
      status: 'resolved',
      createdAt: '2024-01-13T16:45:00Z',
      lastUpdate: '2024-01-14T10:00:00Z',
      messages: 2
    },
    {
      id: 'TKT-004',
      subject: 'Yêu cầu tăng giới hạn sản phẩm',
      category: 'Tài khoản',
      priority: 'medium',
      status: 'closed',
      createdAt: '2024-01-12T11:20:00Z',
      lastUpdate: '2024-01-13T15:30:00Z',
      messages: 4
    }
  ];

  const faqs = [
    {
      id: 1,
      question: 'Làm thế nào để thêm sản phẩm mới?',
      answer: 'Để thêm sản phẩm mới, bạn vào mục "Sản phẩm" trong dashboard, nhấn "Thêm sản phẩm" và điền đầy đủ thông tin sản phẩm.',
      category: 'Sản phẩm',
      helpful: 15
    },
    {
      id: 2,
      question: 'Tôi có thể thay đổi thông tin cửa hàng không?',
      answer: 'Có, bạn có thể thay đổi thông tin cửa hàng trong mục "Cài đặt" > "Thông tin cửa hàng".',
      category: 'Tài khoản',
      helpful: 12
    },
    {
      id: 3,
      question: 'Làm sao để xử lý đơn hàng?',
      answer: 'Bạn vào mục "Đơn hàng" để xem danh sách đơn hàng và cập nhật trạng thái giao hàng.',
      category: 'Đơn hàng',
      helpful: 20
    },
    {
      id: 4,
      question: 'Tôi có thể xuất báo cáo bán hàng không?',
      answer: 'Có, bạn có thể xuất báo cáo trong mục "Thống kê" bằng cách nhấn nút "Xuất báo cáo".',
      category: 'Báo cáo',
      helpful: 8
    }
  ];

  const categories = ['Tất cả', 'Sản phẩm', 'Đơn hàng', 'Thanh toán', 'Tài khoản', 'Kỹ thuật', 'Hướng dẫn', 'Báo cáo'];

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Cao';
      case 'medium':
        return 'Trung bình';
      case 'low':
        return 'Thấp';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Mở';
      case 'in_progress':
        return 'Đang xử lý';
      case 'resolved':
        return 'Đã giải quyết';
      case 'closed':
        return 'Đã đóng';
      default:
        return 'Không xác định';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: 'tickets', name: 'Hỗ trợ kỹ thuật', icon: MessageSquare },
    { id: 'faq', name: 'Câu hỏi thường gặp', icon: HelpCircle },
    { id: 'contact', name: 'Liên hệ', icon: Phone }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hỗ trợ</h1>
          <p className="text-gray-600 mt-1">
            Trung tâm hỗ trợ và liên hệ
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tạo ticket mới</p>
              <p className="text-xs text-gray-500">Gửi yêu cầu hỗ trợ</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tài liệu hướng dẫn</p>
              <p className="text-xs text-gray-500">Xem hướng dẫn sử dụng</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Video className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Video hướng dẫn</p>
              <p className="text-xs text-gray-500">Xem video tutorial</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Phone className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hotline</p>
              <p className="text-xs text-gray-500">1900-1234</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.name}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Hỗ trợ kỹ thuật</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                  <Send className="w-4 h-4 mr-2" />
                  Tạo ticket mới
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm ticket..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Bộ lọc
                  </button>
                </div>
              </div>

              {/* Tickets List */}
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-sm font-medium text-gray-900">{ticket.id}</h3>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                            {getPriorityText(ticket.priority)}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                            {getStatusIcon(ticket.status)}
                            <span className="ml-1">{getStatusText(ticket.status)}</span>
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 mt-1">{ticket.subject}</h4>
                        <p className="text-sm text-gray-500 mt-1">{ticket.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(ticket.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-xs text-gray-400">
                          {ticket.messages} tin nhắn
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Câu hỏi thường gặp</h2>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* FAQ List */}
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{faq.question}</h3>
                        <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                        <div className="flex items-center mt-3 space-x-4">
                          <span className="text-xs text-gray-500">{faq.category}</span>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>Hữu ích: {faq.helpful}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Liên hệ hỗ trợ</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-blue-900">Hotline</h3>
                        <p className="text-sm text-blue-700">1900-1234</p>
                        <p className="text-xs text-blue-600">Thứ 2 - Thứ 6: 8:00 - 17:00</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-green-900">Email</h3>
                        <p className="text-sm text-green-700">support@vendor.com</p>
                        <p className="text-xs text-green-600">Phản hồi trong 24h</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <MessageSquare className="w-5 h-5 text-purple-600 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-purple-900">Live Chat</h3>
                        <p className="text-sm text-purple-700">Chat trực tiếp</p>
                        <p className="text-xs text-purple-600">Thứ 2 - Thứ 6: 8:00 - 17:00</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Gửi tin nhắn</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chủ đề
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập chủ đề..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Danh mục
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Chọn danh mục</option>
                        {categories.slice(1).map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả chi tiết
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Mô tả chi tiết vấn đề của bạn..."
                      />
                    </div>
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center">
                      <Send className="w-4 h-4 mr-2" />
                      Gửi tin nhắn
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
