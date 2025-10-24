'use client';

import Script from 'next/script';

export default function GoogleAnalytics() {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      <Script 
        src="https://www.googletagmanager.com/gtag/js?id=G-S6FR9ZZE2C" 
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-S6FR9ZZE2C');
        `}
      </Script>
    </>
  );
}
