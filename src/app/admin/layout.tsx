'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminGuard } from '@/components/guards';
import { useAuth } from '@/hooks/useAuth';
import { Admin } from '@/types/auth';
import Logo from '@/components/ui/Logo';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  MessageSquare, 
  Maximize2, 
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  FolderOpen,
  Ticket
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
  children?: SidebarItem[];
  badge?: string;
  badgeColor?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Bảng điều khiển',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    children: [
      { name: 'Mặc định', href: '/admin/dashboard' },
      { name: 'CRM', href: '/admin/dashboard/crm' },
      { name: 'Phân tích', href: '/admin/dashboard/analytics', badge: 'mới', badgeColor: 'bg-blue-500' }
    ]
  },
  {
    name: 'Bố cục trang',
    href: '/admin/layouts',
    icon: Package,
    badge: '3',
    badgeColor: 'bg-orange-500'
  },
  {
    name: 'Cơ bản',
    href: '/admin/basic',
    icon: Settings
  },
  {
    name: 'Nâng cao',
    href: '/admin/advance',
    icon: Settings
  },
  {
    name: 'Bổ sung',
    href: '/admin/extra',
    icon: Settings
  }
];

const adminMenuItems: SidebarItem[] = [
  {
    name: 'Người dùng',
    href: '/admin/users',
    icon: Users
  },
  {
    name: 'Sản phẩm',
    href: '/admin/products',
    icon: Package
  },
  {
    name: 'Danh mục',
    href: '/admin/categories',
    icon: FolderOpen
  },
  {
    name: 'Đơn hàng',
    href: '/admin/orders',
    icon: ShoppingCart
  },
  {
    name: 'Voucher',
    href: '/admin/vouchers',
    icon: Ticket
  },
  {
    name: 'Báo cáo',
    href: '/admin/reports',
    icon: BarChart3
  },
  {
    name: 'Cài đặt',
    href: '/admin/settings',
    icon: Settings
  }
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Dashboard']);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const isActive = pathname === item.href;
    const isExpanded = expandedItems.includes(item.name);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.href}>
        <div className="flex items-center">
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.name)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center">
                {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                <span className={isCollapsed ? 'hidden' : ''}>{item.name}</span>
              </div>
              <div className="flex items-center">
                {item.badge && (
                  <span className={`text-xs px-2 py-1 rounded-full text-white ${item.badgeColor} ${isCollapsed ? 'hidden' : ''}`}>
                    {item.badge}
                  </span>
                )}
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 ml-2" />
                ) : (
                  <ChevronRight className="w-4 h-4 ml-2" />
                )}
              </div>
            </button>
          ) : (
            <Link
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              {item.icon && <item.icon className="w-5 h-5 mr-3" />}
              <span className={isCollapsed ? 'hidden' : ''}>{item.name}</span>
              {item.badge && (
                <span className={`text-xs px-2 py-1 rounded-full text-white ${item.badgeColor} ml-auto ${isCollapsed ? 'hidden' : ''}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className={`ml-6 mt-1 space-y-1 ${isCollapsed ? 'hidden' : ''}`}>
            {item.children?.map(child => (
              <Link
                key={child.href}
                href={child.href}
                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                  pathname === child.href
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <span>{child.name}</span>
                {child.badge && (
                  <span className={`text-xs px-2 py-1 rounded-full text-white ${child.badgeColor} ml-auto`}>
                    {child.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-gray-800 text-white transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen flex flex-col`}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          {!isCollapsed ? (
            <Logo size="sm" showText={true} className="text-white" />
          ) : (
            <Logo size="sm" showText={false} />
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-gray-700 rounded transition-all"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {!isCollapsed && 'Điều hướng'}
          </h3>
          <div className="space-y-1">
            {sidebarItems.map(item => renderSidebarItem(item))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {!isCollapsed && 'Quản trị hệ thống'}
          </h3>
          <div className="space-y-1">
            {adminMenuItems.map(item => renderSidebarItem(item))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface HeaderProps {
  user: Admin;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Search className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Maximize2 className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <MessageSquare className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {user?.fullName || user?.username}
              </span>
              <span className="text-xs text-gray-500">Quản trị viên</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const admin = user as Admin;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <Sidebar 
            isCollapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
          
          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <Header user={admin} />
            
            {/* Page content */}
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
