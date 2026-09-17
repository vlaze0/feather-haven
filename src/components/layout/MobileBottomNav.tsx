'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bird, ShoppingBag, User, UtensilsCrossed } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAppMode } from '@/lib/use-app-mode';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cart } = useCart();
  const { isApp, isLoaded } = useAppMode();

  // Only show bottom nav in APP mode (PWA / APK) — never on the regular website
  if (!isApp || !isLoaded) {
    return null;
  }

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'Birds',
      href: '/birds',
      icon: Bird,
      isActive: pathname.startsWith('/birds'),
    },
    {
      label: 'Food',
      href: '/food',
      icon: UtensilsCrossed,
      isActive: pathname.startsWith('/food'),
    },
    {
      label: 'Cart',
      href: '/cart',
      icon: ShoppingBag,
      badge: totalCartCount > 0 ? totalCartCount : null,
      isActive: pathname.startsWith('/cart'),
    },
    {
      label: 'Account',
      href: '/account',
      icon: User,
      isActive: pathname.startsWith('/account') || pathname.startsWith('/login'),
    },
  ];

  return (
    <nav
      aria-label="App Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-pb"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                active ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${active ? 'scale-110' : ''}`} />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[10px] font-black rounded-full h-4 min-w-4 px-1 flex items-center justify-center shadow-sm">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">{item.label}</span>
              {active && (
                <span className="w-1 h-1 bg-emerald-600 rounded-full mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
