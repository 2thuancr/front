'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import Footer from './Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if current path is admin, vendor, or staff dashboard
  const isAdminPage = pathname.startsWith('/admin') || 
                     pathname.startsWith('/vendor') || 
                     pathname.startsWith('/staff');

  return (
    <>
      {!isAdminPage && <Navigation />}
      <main>
        {children}
      </main>
      {!isAdminPage && <Footer />}
    </>
  );
}
