# 🚀 MTSE Final - Frontend Application

## 📋 Tổng quan

Ứng dụng frontend hiện đại được xây dựng với Next.js 14, TailwindCSS và Redux Toolkit. Giao diện được thiết kế đẹp mắt với animation mượt mà và responsive design.

## ✨ Tính năng chính

### 🔐 Authentication System
- **Login**: Form đăng nhập với validation
- **Register**: Form đăng ký tài khoản mới  
- **Forgot Password**: Form quên mật khẩu
- **OTP Verification**: Xác thực OTP 6 số
- **Profile Management**: Quản lý thông tin cá nhân

### 🎨 UI/UX Features
- **Modern Design**: Giao diện hiện đại với gradient và shadow
- **Responsive**: Tối ưu cho mọi thiết bị
- **Animations**: Framer Motion animations mượt mà
- **Dark Mode Ready**: Sẵn sàng cho dark mode
- **Accessibility**: Tuân thủ tiêu chuẩn accessibility

### 🏗️ Technical Features
- **TypeScript**: Type safety hoàn chỉnh
- **Redux Toolkit**: State management hiện đại
- **React Hook Form**: Form handling với validation
- **TailwindCSS**: Utility-first CSS framework
- **Next.js 14**: App Router và server components

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: [http://localhost:3000](http://localhost:3000)

### Build production
```bash
npm run build
npm start
```

## 📁 Cấu trúc thư mục

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   │   ├── login/         # Login page
│   │   ├── register/      # Register page
│   │   └── forgot-password/ # Forgot password page
│   ├── profile/           # Profile page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/                # Base UI components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── home/              # Home page components
├── lib/                   # Utility libraries
├── store/                 # Redux store
├── hooks/                 # Custom hooks
├── types/                 # TypeScript types
└── styles/                # Additional styles
```

## 🎨 Components

### UI Components
- **Button**: Button với nhiều variants và sizes
- **Input**: Input field với validation states
- **Card**: Card component với shadow và border

### Form Components
- **LoginForm**: Form đăng nhập
- **RegisterForm**: Form đăng ký
- **ForgotPasswordForm**: Form quên mật khẩu
- **OTPVerificationForm**: Form xác thực OTP
- **ProfileForm**: Form quản lý profile

### Home Components
- **Hero**: Hero section với animation
- **Features**: Features section
- **ProductGrid**: Grid hiển thị sản phẩm

## 🔧 Configuration

### TailwindCSS
File `tailwind.config.ts` chứa:
- Custom animations (blob, fade-in, slide-up)
- Custom colors
- Animation delays

### Redux Store
- **authSlice**: Quản lý authentication state
- **userSlice**: Quản lý user profile state

### API Configuration
- Axios instance với interceptors
- JWT token handling
- Error handling

## 🎯 Routes

- `/` - Trang chủ
- `/login` - Đăng nhập
- `/register` - Đăng ký
- `/forgot-password` - Quên mật khẩu
- `/profile` - Quản lý profile

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 📱 Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🎨 Design System

### Colors
- **Primary**: Blue tones (#3B82F6)
- **Secondary**: Gray tones (#6B7280)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)
- **Warning**: Yellow (#F59E0B)

### Typography
- **Font Family**: Inter
- **Heading**: Bold weights
- **Body**: Regular weights

### Spacing
- **xs**: 4px, **sm**: 8px, **md**: 16px
- **lg**: 24px, **xl**: 32px, **2xl**: 48px

## 🔒 Security

- JWT token storage
- Input validation & sanitization
- CSRF protection
- Secure headers

## 📈 Performance

- Code splitting
- Image optimization
- Bundle optimization
- Lazy loading

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 🆘 Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra documentation
2. Tìm trong issues
3. Tạo issue mới

---

**Made with ❤️ by MTSE Team**
