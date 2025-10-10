import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/store/provider';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { ViewTrackingProvider } from '@/components/providers/ViewTrackingProvider';
import { AuthInitializer } from '@/components/providers/AuthInitializer';
import { WishlistInitializer } from '@/components/providers/WishlistInitializer';
import { ToastProvider } from '@/components/ui/Toast';
import { APP_CONFIG } from '@/lib/constants';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: APP_CONFIG.NAME,
  description: APP_CONFIG.DESCRIPTION,
  authors: [{ name: APP_CONFIG.AUTHOR }],
  keywords: ['HCMUTE', 'Gift Shop', 'University', 'Merchandise'],
  openGraph: {
    title: APP_CONFIG.NAME,
    description: APP_CONFIG.DESCRIPTION,
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_CONFIG.NAME,
    description: APP_CONFIG.DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
          <AuthInitializer />
          <WishlistInitializer />
          <ToastProvider>
            <ViewTrackingProvider>
              <Navigation />
              <main>
                {children}
              </main>
              <Footer />
            </ViewTrackingProvider>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
