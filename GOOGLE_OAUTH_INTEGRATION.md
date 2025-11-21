# Google OAuth Integration

## Tổng quan
Đã tích hợp thành công chức năng đăng nhập với Google vào ứng dụng. Người dùng có thể đăng nhập bằng tài khoản Google của họ thay vì sử dụng email/mật khẩu truyền thống.

## Các thay đổi đã thực hiện

### 1. Dependencies
- Cài đặt `@google-cloud/local-auth` và `googleapis` để hỗ trợ Google OAuth

### 2. API Integration
- Thêm endpoint `googleLogin` vào `authAPI` trong `src/lib/api.ts`
- Endpoint: `POST /auth/google-login` với payload `{ googleToken: string }`

### 3. Types
- Thêm `GoogleLoginCredentials` interface trong `src/types/auth.ts`

### 4. Authentication Hook
- Thêm `googleLogin` function vào `useAuth` hook
- Function này xử lý Google token và tự động redirect sau khi đăng nhập thành công

### 5. UI Components
- Tạo `GoogleLoginButton` component trong `src/components/ui/GoogleLoginButton.tsx`
- Tích hợp Google Identity Services
- Hỗ trợ loading state và error handling

### 6. Login Form
- Tích hợp Google Login Button vào `LoginForm`
- Thêm divider "Hoặc" giữa form đăng nhập thông thường và Google login
- Thêm success/error handlers

### 7. Environment Variables
- Thêm `NEXT_PUBLIC_GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` vào `env.example`

## Cách sử dụng

### 1. Thiết lập Google OAuth
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Kích hoạt Google+ API
4. Tạo OAuth 2.0 credentials
5. Thêm authorized redirect URIs:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)

### 2. Cấu hình Environment Variables
Tạo file `.env.local` với nội dung:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 3. Backend Integration
Backend cần implement endpoint `/auth/google-login` để:
1. Verify Google token
2. Tạo hoặc tìm user trong database
3. Trả về JWT token và user data

### 4. Sử dụng trong Component
```tsx
import { GoogleLoginButton } from '@/components/ui';

<GoogleLoginButton
  onSuccess={(result) => console.log('Login successful:', result)}
  onError={(error) => console.error('Login error:', error)}
  disabled={false}
/>
```

## Tính năng

- ✅ Đăng nhập bằng Google OAuth
- ✅ Tự động redirect sau khi đăng nhập thành công
- ✅ Error handling và loading states
- ✅ Responsive design
- ✅ Tương thích với hệ thống authentication hiện có
- ✅ Hỗ trợ multiple user types (customer, admin, vendor, staff)

## Lưu ý

1. **Security**: Google token được verify ở backend trước khi tạo session
2. **User Experience**: Người dùng có thể chọn đăng nhập bằng Google hoặc email/password
3. **Fallback**: Nếu Google services không load được, sẽ hiển thị error message
4. **Compatibility**: Tương thích với React 19 và Next.js 15

## Testing

1. Đảm bảo Google OAuth credentials được cấu hình đúng
2. Test trên localhost với Google OAuth sandbox
3. Verify backend endpoint `/auth/google-login` hoạt động
4. Test error cases (network issues, invalid tokens, etc.)
