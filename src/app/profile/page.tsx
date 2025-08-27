'use client';

import React, { useEffect } from 'react';
import ProfileForm from '@/components/forms/ProfileForm';
import { useProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
  const { profile, isLoading, error, fetchProfile, updateProfile } = useProfile();

  useEffect(() => {
    // Fetch profile when component mounts
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateProfile = async (data: any) => {
    try {
      await updateProfile(data);
      alert('Cập nhật hồ sơ thành công!');
    } catch (error) {
      console.error('Update profile error:', error);
      alert('Có lỗi xảy ra khi cập nhật hồ sơ!');
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <div className="container mx-auto py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin hồ sơ...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <div className="container mx-auto py-8">
          <div className="text-center">
            <p className="text-gray-600">Không thể tải thông tin hồ sơ</p>
            <button 
              onClick={fetchProfile}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hồ sơ cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin cá nhân và tài khoản của bạn</p>
        </div>
        
        <ProfileForm
          profile={profile}
          onUpdate={handleUpdateProfile}
          isLoading={isLoading}
          {...(error && { error })}
        />
      </div>
    </div>
  );
}


