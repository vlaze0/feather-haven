'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bird,
  Package,
  ShoppingBag,
  AlertTriangle,
  Tag,
  Users,
  MessageSquare,
  FileText,
  Sliders,
  ExternalLink,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Overview Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Manage Birds', href: '/admin/birds', icon: Bird },
    { label: 'Manage Products', href: '/admin/products', icon: Package },
    { label: 'Orders & Fulfillment', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Inventory & Stock Alerts', href: '/admin/inventory', icon: AlertTriangle },
    { label: 'Discount Coupons', href: '/admin/coupons', icon: Tag },
    { label: 'Customer Directory', href: '/admin/customers', icon: Users },
    { label: 'Review Approvals', href: '/admin/reviews', icon: MessageSquare },
    { label: 'Homepage & Content', href: '/admin/content', icon: Sliders },
    { label: 'Care Guides & Blog', href: '/admin/care-guides', icon: FileText },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand */}
        <div className="pb-5 mb-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-emerald-500/20">
              <Bird className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base block tracking-tight">Admin Console</span>
              <span className="text-[10px] text-emerald-400 font-mono block">Feather Haven v1.0</span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer link back to website */}
      <div className="pt-5 mt-5 border-t border-slate-800 space-y-2">
        <Link
          href="/customizer"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold text-amber-300 rounded-xl border border-amber-500/30 transition-colors"
        >
          <span className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Customizer</span>
          </span>
          <ExternalLink className="w-3 h-3 text-amber-400" />
        </Link>
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 bg-slate-800/80 hover:bg-slate-800 text-xs font-medium text-slate-300 rounded-xl transition-colors"
        >
          <span>View Public Shop</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top App Bar */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30 w-full">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl"
            aria-label="Open Admin Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
              <Bird className="w-4 h-4" />
            </div>
            <span className="font-black text-white text-sm">Admin Console</span>
          </div>
        </div>
        <Link
          href="/"
          className="text-xs text-emerald-400 hover:underline flex items-center space-x-1"
        >
          <span>Shop</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] bg-slate-900 p-5 h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-300 min-h-screen p-5 flex-col justify-between border-r border-slate-800 shrink-0 sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </aside>
    </>
  );
}
