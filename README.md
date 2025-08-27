# HCMUTE Gift Shop - Frontend

Frontend application cho HCMUTE Gift Shop được xây dựng với Next.js 15 và các công nghệ hiện đại.

## 🚀 Tính năng

- **Next.js 15** với App Router
- **TypeScript** cho type safety
- **Tailwind CSS** cho styling
- **PrimeReact** cho UI components
- **Redux Toolkit** cho state management
- **Axios** cho API calls
- **ESLint & Prettier** cho code quality

## 🏗️ Cấu trúc dự án

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (grouped)
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # Reusable components
│   ├── forms/             # Form components
│   ├── home/              # Home page components
│   ├── layout/            # Layout components
│   └── ui/                # UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
│   ├── api.ts             # API client
│   ├── constants.ts       # App constants
│   └── utils.ts           # Utility functions
├── store/                  # Redux store
├── styles/                 # Global styles
└── types/                  # TypeScript type definitions
```

## 🛠️ Cài đặt

1. **Clone repository:**
   ```bash
   git clone <repository-url>
   cd front
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

3. **Tạo file môi trường:**
   ```bash
   cp env.example .env.local
   # Cập nhật các biến môi trường trong .env.local
   ```

4. **Chạy development server:**
   ```bash
   npm run dev
   ```

## 📝 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run start` - Chạy production server
- `npm run lint` - Kiểm tra code quality
- `npm run lint:fix` - Tự động sửa lỗi linting
- `npm run type-check` - Kiểm tra TypeScript
- `npm run clean` - Xóa build files
- `npm run analyze` - Phân tích bundle size

## 🔧 Cấu hình

### Next.js
- **Turbopack** cho development
- **Image optimization** với WebP/AVIF
- **Security headers** tự động
- **Bundle optimization** cho production

### TypeScript
- **Strict mode** enabled
- **Path aliases** cho imports
- **Modern ES2022** target

### ESLint & Prettier
- **Next.js rules** tích hợp
- **TypeScript rules** tối ưu
- **Code formatting** tự động

## 🌐 API Integration

- **Axios client** với interceptors
- **Token refresh** tự động
- **Error handling** tập trung
- **Type-safe** API calls

## 📱 Responsive Design

- **Mobile-first** approach
- **Tailwind CSS** utilities
- **PrimeReact** components
- **Custom breakpoints**

## 🚀 Performance

- **Code splitting** tự động
- **Image optimization**
- **Bundle analysis**
- **Lazy loading** components

## 🔒 Security

- **Environment variables**
- **Security headers**
- **Token management**
- **Input validation**

## 📚 Best Practices

- **Component composition**
- **Custom hooks** cho logic
- **Type safety** với TypeScript
- **Error boundaries**
- **Loading states**
- **Accessibility** support

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🆘 Support

Nếu có vấn đề, vui lòng tạo issue hoặc liên hệ team development.
