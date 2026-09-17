import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

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
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" href="/images/products/cage_customised_aviary.jpg" />
      </head>
      <body className="flex flex-col min-h-screen">
        <CartProvider>
          <Header />
          <main className="flex-1 pb-16 lg:pb-0">{children}</main>
          <WhatsAppButton />
          <Footer />
          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
