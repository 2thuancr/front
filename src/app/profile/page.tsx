'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProfileFormNew from '@/components/forms/ProfileFormNew';
import ProfileSidebar from '@/components/layout/ProfileSidebar';
import { useProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
  const { profile, isLoading, error, fetchProfile, updateProfile } = useProfile();
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    // Fetch profile when component mounts
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateProfile = async (data: any) => {
    try {
      await updateProfile(data);
      // Refresh profile to get updated data
      await fetchProfile();
      // console.log('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      alert('Có lỗi xảy ra khi cập nhật hồ sơ!');
    }
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
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
          className="flex-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ProfileFormNew
            profile={profile}
            onUpdate={handleUpdateProfile}
            isLoading={isLoading}
            error={error as any}
            onRefresh={fetchProfile}
          />
        </motion.div>
      </div>
    </div>
  );
}


