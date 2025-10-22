'use client';

import React, { useState } from 'react';
import { StaffGuard } from '@/components/guards';
import { useAuth } from '@/hooks/useAuth';
import { Staff } from '@/types/auth';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  Calendar,
  FileText,
  Send,
  Search,
  Filter
} from 'lucide-react';

interface SupportTicket {
  id: number;
  title: string;
  description: string;
  customerName: string;
  customerEmail: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: 'technical' | 'billing' | 'general' | 'complaint';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  response?: string;
}

const mockTickets: SupportTicket[] = [
  {
    id: 1,
    title: 'Không thể đăng nhập vào tài khoản',
    description: 'Tôi đã thử đăng nhập nhiều lần nhưng không thành công. Hệ thống báo lỗi mật khẩu không đúng.',
    customerName: 'Nguyễn Văn A',
    customerEmail: 'nguyenvana@email.com',
    priority: 'high',
    status: 'in_progress',
    category: 'technical',
    createdAt: '2024-03-20T10:30:00Z',
    updatedAt: '2024-03-20T14:15:00Z',
    assignedTo: 'Nhân viên hỗ trợ',
    response: 'Chúng tôi đã kiểm tra và phát hiện vấn đề với hệ thống xác thực. Đang khắc phục.'
  },
  {
    id: 2,
    title: 'Yêu cầu hoàn tiền đơn hàng',
    description: 'Tôi muốn hoàn tiền cho đơn hàng #12345 vì sản phẩm bị lỗi.',
    customerName: 'Trần Thị B',
    customerEmail: 'tranthib@email.com',
    priority: 'medium',
    status: 'open',
    category: 'billing',
    createdAt: '2024-03-19T15:45:00Z',
    updatedAt: '2024-03-19T15:45:00Z'
  },
  {
    id: 3,
    title: 'Thắc mắc về chính sách đổi trả',
    description: 'Tôi muốn biết thời gian đổi trả sản phẩm là bao lâu?',
    customerName: 'Lê Văn C',
    customerEmail: 'levanc@email.com',
    priority: 'low',
    status: 'resolved',
    category: 'general',
    createdAt: '2024-03-18T09:20:00Z',
    updatedAt: '2024-03-18T16:30:00Z',
    assignedTo: 'Nhân viên hỗ trợ',
    response: 'Chính sách đổi trả của chúng tôi là 30 ngày kể từ ngày nhận hàng.'
  },
  {
    id: 4,
    title: 'Khiếu nại về chất lượng dịch vụ',
    description: 'Dịch vụ giao hàng chậm và nhân viên không lịch sự.',
    customerName: 'Phạm Thị D',
    customerEmail: 'phamthid@email.com',
    priority: 'urgent',
    status: 'open',
    category: 'complaint',
    createdAt: '2024-03-21T08:15:00Z',
    updatedAt: '2024-03-21T08:15:00Z'
  }
];

export default function StaffSupportPage() {
  const { user } = useAuth();
  const staff = user as Staff;
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responseText, setResponseText] = useState('');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Mở';
      case 'in_progress': return 'Đang xử lý';
      case 'resolved': return 'Đã giải quyết';
      case 'closed': return 'Đã đóng';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Khẩn cấp';
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return priority;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'technical': return 'Kỹ thuật';
      case 'billing': return 'Thanh toán';
      case 'general': return 'Chung';
      case 'complaint': return 'Khiếu nại';
      default: return category;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSendResponse = () => {
    if (selectedTicket && responseText.trim()) {
      const updatedTickets = tickets.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { ...ticket, response: responseText, status: 'resolved' as const, updatedAt: new Date().toISOString() }
          : ticket
      );
      setTickets(updatedTickets);
      setResponseText('');
      setSelectedTicket(null);
    }
  };

  const handleUpdateStatus = (ticketId: number, newStatus: SupportTicket['status']) => {
    const updatedTickets = tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() }
        : ticket
    );
    setTickets(updatedTickets);
  };

  return (
    <StaffGuard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hỗ trợ khách hàng</h1>
            <p className="text-gray-600">Quản lý và xử lý các yêu cầu hỗ trợ</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <MessageSquare className="w-4 h-4 mr-2" />
              Ticket mới
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <HelpCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng ticket</p>
                <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang mở</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.status === 'open').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang xử lý</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã giải quyết</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm ticket..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="open">Mở</option>
                <option value="in_progress">Đang xử lý</option>
                <option value="resolved">Đã giải quyết</option>
                <option value="closed">Đã đóng</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả mức độ</option>
                <option value="urgent">Khẩn cấp</option>
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mức độ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">#{ticket.id}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{ticket.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{ticket.customerName}</div>
                          <div className="text-sm text-gray-500">{ticket.customerEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{getCategoryText(ticket.category)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {getPriorityText(ticket.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {getStatusText(ticket.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(ticket.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Xem chi tiết
                      </button>
                      {ticket.status === 'open' && (
                        <button
                          onClick={() => handleUpdateStatus(ticket.id, 'in_progress')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Nhận xử lý
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Ticket #{selectedTicket.id}</h3>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Đóng</span>
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedTicket.title}</h4>
                  <p className="text-sm text-gray-600 mt-2">{selectedTicket.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Khách hàng</label>
                    <p className="text-sm text-gray-900">{selectedTicket.customerName}</p>
                    <p className="text-sm text-gray-500">{selectedTicket.customerEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Ngày tạo</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedTicket.createdAt)}</p>
                  </div>
                </div>

                {selectedTicket.response && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phản hồi</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTicket.response}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700">Phản hồi mới</label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Nhập phản hồi cho khách hàng..."
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSendResponse}
                    disabled={!responseText.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Gửi phản hồi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy ticket</h3>
            <p className="mt-1 text-sm text-gray-500">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </StaffGuard>
  );
}
