'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProfileFormNew from '@/components/forms/ProfileFormNew';
import ProfileSidebar from '@/components/layout/ProfileSidebar';
import { useProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
  const { profile, isLoading, error, fetchProfile } = useProfile();
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    // Fetch profile when component mounts
    fetchProfile();
  }, [fetchProfile]);


  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin hồ sơ...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile && error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-96">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">⚠️ Backend không khả dụng!</p>
              <p className="text-sm">Không thể kết nối đến server backend</p>
            </div>
            
            <p className="text-gray-600 mb-4">Không thể tải thông tin hồ sơ từ server</p>
            <p className="text-sm text-gray-500 mb-4">Lỗi: {error || 'Không xác định'}</p>
            
            <div className="space-y-2">
              <button 
                onClick={fetchProfile}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
              >
                Thử lại
              </button>
              
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Refresh trang
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProfileSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              userProfile={profile as any}
            />
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
                <ProfileFormNew
                  profile={profile}
                  onRefresh={fetchProfile}
                />
          </motion.div>
        </div>
      </div>
    </div>
  );
}


