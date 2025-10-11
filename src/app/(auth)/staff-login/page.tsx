import React from 'react';
import LoginForm from '@/components/forms/LoginForm';

export default function StaffLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập nhân viên</h1>
          <p className="text-gray-600">Sử dụng email và mật khẩu để đăng nhập</p>
        </div>
        <LoginForm />
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Quay lại{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              trang đăng nhập chính
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
