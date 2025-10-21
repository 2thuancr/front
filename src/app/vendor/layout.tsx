'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VendorGuard } from '@/components/guards';
import { useAuth } from '@/hooks/useAuth';
import { Vendor } from '@/types/auth';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  MessageSquare, 
  Maximize2, 
  Eye,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  Store,
  Star,
  HelpCircle,
  Users,
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

const vendorMenuItems: SidebarItem[] = [
  {
    name: 'Bảng điều khiển',
    href: '/vendor/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Sản phẩm',
    href: '/vendor/products',
    icon: Package
  },
  {
    name: 'Danh mục',
    href: '/vendor/categories',
    icon: FolderOpen
  },
  {
    name: 'Voucher',
    href: '/vendor/vouchers',
    icon: Ticket
  },
  {
    name: 'Đơn hàng',
    href: '/vendor/orders',
    icon: ShoppingCart,
    badge: '5',
    badgeColor: 'bg-orange-500'
  },
  {
    name: 'Nhân viên',
    href: '/vendor/staff',
    icon: Users
  },
  {
    name: 'Thống kê',
    href: '/vendor/analytics',
    icon: BarChart3
  },
  {
    name: 'Đánh giá',
    href: '/vendor/reviews',
    icon: Star
  },
  {
    name: 'Cài đặt',
    href: '/vendor/settings',
    icon: Settings
  },
  {
    name: 'Hỗ trợ',
    href: '/vendor/support',
    icon: HelpCircle
  }
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="ml-2 text-xl font-bold">VENDOR</span>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-gray-700 rounded"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {!isCollapsed && 'Quản lý cửa hàng'}
          </h3>
          <div className="space-y-1">
            {vendorMenuItems.map(item => renderSidebarItem(item))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface HeaderProps {
  user: Vendor;
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
                {user?.ownerName || user?.storeName}
              </span>
              <span className="text-xs text-gray-500">Nhà cung cấp</span>
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

interface VendorLayoutProps {
  children: React.ReactNode;
}

export default function VendorLayout({ children }: VendorLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const vendor = user as Vendor;

  return (
    <VendorGuard>
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
            <Header user={vendor} />
            
            {/* Page content */}
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </VendorGuard>
  );
}
