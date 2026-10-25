import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import AppBottomPadding from '@/components/layout/AppBottomPadding';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#059669',
};

export const metadata: Metadata = {
  title: 'Feather Haven | Premium Bird Shop & Aviary',
  description:
    'Buy healthy budgies, parakeets, exotic pet birds, non-toxic cages, gourmet seed mixes, and accessories online in India. Certified aviary with safe delivery.',
  keywords: 'bird shop, buy budgies online, parakeet cage, bird food, millet spray, aviary Bengaluru',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FeatherHaven',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Inter font via Google CDN — loads at runtime, not at build time */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="flex flex-col min-h-screen font-sans">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <WhatsAppButton />
          <Footer />
          <AppBottomPadding />
          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
