import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/store/provider';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import { ViewTrackingProvider } from '@/components/providers/ViewTrackingProvider';
import { AuthInitializer } from '@/components/providers/AuthInitializer';
import { WishlistInitializer } from '@/components/providers/WishlistInitializer';
import { NotificationProvider } from '@/components/providers/NotificationProvider';
import { ToastProvider } from '@/components/ui/Toast';
import { APP_CONFIG } from '@/lib/constants';
import { ErrorBoundary, ChunkErrorFallback } from '@/components/ErrorBoundary';

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Handle chunk loading errors
              window.addEventListener('error', function(e) {
                if (e.message && e.message.includes('Loading chunk')) {
                  console.warn('Chunk loading error detected, reloading page...');
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
              });
              
              // Handle unhandled promise rejections
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.message && e.reason.message.includes('Loading chunk')) {
                  console.warn('Chunk loading promise rejection, reloading page...');
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
              });
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ErrorBoundary fallback={ChunkErrorFallback}>
          <Providers>
            <AuthInitializer />
            <WishlistInitializer />
            <ToastProvider>
              <NotificationProvider>
                <ViewTrackingProvider>
                  <ConditionalLayout>
                    {children}
                  </ConditionalLayout>
                </ViewTrackingProvider>
              </NotificationProvider>
            </ToastProvider>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
