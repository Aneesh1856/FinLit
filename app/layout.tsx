import type { Metadata, Viewport } from 'next';
import './globals.css';
import AuthHandler from '@/components/AuthHandler';

export const metadata: Metadata = {
  title: 'FinLit — Master Money. Make Smarter Decisions.',
  description:
    'A gamified, AI-powered financial literacy platform for India. Learn budgeting, investing, taxes, and more in just 5 minutes a day.',
  keywords: 'financial literacy, personal finance India, SIP, EMI, budgeting, Gemini AI, investing',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FinLit',
  },
  openGraph: {
    title: 'FinLit – Master Money. Make Smarter Decisions.',
    description: 'Human-centric AI financial education for India. Gamified learning, AI coach, simulators.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#2A5DFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#2A5DFF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FinLit" />
      </head>
      <body>
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <AuthHandler />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
