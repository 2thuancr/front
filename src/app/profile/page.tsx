import React from 'react';
import ProfileForm from '@/components/forms/ProfileForm';
import { UserProfile } from '@/types/user';

export default function ProfilePage() {
  // Mock data - replace with actual user data from Redux store
  const mockProfile: UserProfile = {
    id: '1',
    email: 'user@example.com',
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    avatar: '',
    phone: '+84 123 456 789',
    address: 'Hà Nội, Việt Nam',
    bio: 'Lập trình viên full-stack với 5 năm kinh nghiệm trong phát triển web và mobile. Tôi thích tạo ra những ứng dụng đẹp và hữu ích cho người dùng.',
    dateOfBirth: '1995-06-15',
    gender: 'male',
    role: 'user',
    isEmailVerified: true,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-08-27T00:00:00Z',
  };

  const handleUpdateProfile = async (data: any) => {
    // TODO: Implement profile update logic
    console.log('Update profile:', data);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Cập nhật hồ sơ thành công!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hồ sơ cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin cá nhân và tài khoản của bạn</p>
        </div>
        
        <ProfileForm
          profile={mockProfile}
          onUpdate={handleUpdateProfile}
        />
      </div>
    </div>
  );
}
