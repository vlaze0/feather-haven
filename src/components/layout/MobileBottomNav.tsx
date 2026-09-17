'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bird, Sparkles, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cart } = useCart();

  // Hide bottom nav on admin routes to prevent conflict with admin navigation
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
      label: 'Customizer',
      href: '/customizer',
      icon: Sparkles,
      highlight: true,
      isActive: pathname.startsWith('/customizer'),
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
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-pb"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-4 group relative"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-emerald-500/40 ring-4 ring-emerald-100 scale-105'
                      : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/30 group-hover:scale-105'
                  }`}
                >
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <span
                  className={`text-[10px] font-black tracking-tight mt-1 transition-colors ${
                    active ? 'text-emerald-700' : 'text-slate-600'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

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
