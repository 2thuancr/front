import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/store/provider';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gift Shop HCMUTE',
  description: 'HCMUTE Gift Shop - Nơi lưu giữ những kỷ niệm đẹp của trường Đại học Sư phạm Kỹ thuật TP.HCM',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        {/* PrimeReact CSS */}
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/primereact@10.5.3/resources/themes/lara-light-blue/theme.css" 
        />
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/primereact@10.5.3/resources/primereact.min.css" 
        />
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/primeicons@6.0.1/primeicons.css" 
        />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>
          <Navigation />
          <main>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
