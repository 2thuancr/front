'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  User, 
  FileText, 
  Tag, 
  Coins,
  CreditCard,
  MapPin,
  Lock,
  Settings,
  Shield,
  UserCheck,
  Edit3,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from 'primereact/button';

interface ProfileSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userProfile?: {
    username?: string | undefined;
    avatar?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
  } | null;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeSection,
  onSectionChange,
  userProfile
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['notifications']); // Mở sẵn "Thông Báo"

  const navigationItems = [
    {
      id: 'notifications',
      label: 'Thông Báo',
      icon: Bell,
      children: [
        { id: 'order-updates', label: 'Cập Nhật Đơn Hàng', icon: FileText },
        { id: 'promotions', label: 'Khuyến Mãi', icon: Tag },
        { id: 'wallet-updates', label: 'Cập Nhật Ví', icon: Coins }
      ]
    },
    {
      id: 'account',
      label: 'Hồ Sơ Của Tôi',
      icon: User,
      children: []
    },
    {
      id: 'orders',
      label: 'Đơn Mua',
      icon: FileText,
      children: []
    },
    {
      id: 'vouchers',
      label: 'Kho Voucher',
      icon: Tag,
      children: []
    },
    {
      id: 'coins',
      label: 'Shopee Xu',
      icon: Coins,
      children: []
    }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return '?';
  };

  const getAvatarUrl = (avatarPath?: string) => {
    if (!avatarPath || avatarPath.trim() === '') return null;
    return avatarPath.startsWith('http') ? avatarPath : `http://localhost:3001${avatarPath}`;
  };

  return (
    <div className="w-80 bg-white shadow-lg">
      {/* User Profile Summary */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg relative overflow-hidden">
              {getAvatarUrl(userProfile?.avatar) ? (
                <img
                  src={getAvatarUrl(userProfile?.avatar)!}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                  onError={(e) => {
                    console.log('Sidebar avatar load error:', userProfile?.avatar);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
              
              {/* Fallback initials */}
              {(!userProfile?.avatar || userProfile.avatar.trim() === '') && (
                <span className="absolute inset-0 flex items-center justify-center">
                  {getInitials(userProfile?.firstName, userProfile?.lastName)}
                </span>
              )}
            </div>
          </motion.div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              {userProfile?.username || 'username'}
            </h3>
            <Button
              label="Sửa Hồ Sơ"
              icon={<Edit3 className="w-4 h-4" />}
              className="p-button-text p-button-sm text-orange-600 hover:text-orange-700 mt-2"
              onClick={() => onSectionChange('profile')}
            />
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="p-4 bg-white">
        {navigationItems.map((item) => {
          const isExpanded = expandedItems.includes(item.id);
          const hasChildren = item.children.length > 0;
          
          return (
            <div key={item.id} className="mb-2">
              {/* Main Item */}
              <motion.div
                className="relative"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                                       <Button
                         label={item.label}
                         icon={<item.icon className={`w-4 h-4 ${
                           activeSection === item.id ? 'text-orange-600 !important' : 'text-gray-500 !important'
                         }`} style={{
                           color: activeSection === item.id ? '#ea580c' : '#6b7280'
                         }} />}
                         className={`w-full justify-start p-3 text-left ${
                           activeSection === item.id
                             ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500 font-semibold'
                             : 'text-gray-700 hover:bg-gray-50'
                         }`}
                         style={{
                           color: activeSection === item.id ? '#ea580c' : '#374151',
                           backgroundColor: activeSection === item.id ? '#fff7ed' : 'transparent',
                           borderLeft: activeSection === item.id ? '4px solid #f97316' : 'none',
                           fontWeight: activeSection === item.id ? '600' : 'normal'
                         }}
                         text
                         onClick={() => {
                           if (hasChildren) {
                             toggleExpanded(item.id);
                           } else {
                             onSectionChange(item.id);
                           }
                         }}
                       />
                
                                       {/* Dropdown Arrow */}
                       {hasChildren && (
                         <motion.div
                           className="absolute right-3 top-1/2 transform -translate-y-1/2"
                           animate={{ rotate: isExpanded ? 90 : 0 }}
                           transition={{ duration: 0.2 }}
                         >
                           <ChevronRight className={`w-4 h-4 ${
                             activeSection === item.id ? 'text-orange-500 !important' : 'text-gray-400 !important'
                           }`} style={{
                             color: activeSection === item.id ? '#f97316' : '#9ca3af'
                           }} />
                         </motion.div>
                       )}
              </motion.div>

              {/* Children Items */}
              <AnimatePresence>
                {hasChildren && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <motion.div
                          key={child.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          whileHover={{ x: 4 }}
                        >
                                                           <Button
                                   label={child.label}
                                   icon={<child.icon className={`w-4 h-4 ${
                                     activeSection === child.id ? 'text-orange-600 !important' : 'text-gray-500 !important'
                                   }`} style={{
                                     color: activeSection === child.id ? '#ea580c' : '#6b7280'
                                   }} />}
                                   className={`w-full justify-start p-2 text-left text-sm ${
                                     activeSection === child.id
                                       ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-500 font-semibold'
                                       : 'text-gray-600 hover:bg-gray-50'
                                   }`}
                                   style={{
                                     color: activeSection === child.id ? '#ea580c' : '#4b5563',
                                     backgroundColor: activeSection === child.id ? '#fed7aa' : 'transparent',
                                     borderLeft: activeSection === child.id ? '4px solid #f97316' : 'none',
                                     fontWeight: activeSection === child.id ? '600' : 'normal'
                                   }}
                                   text
                                   onClick={() => onSectionChange(child.id)}
                                 />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSidebar;
