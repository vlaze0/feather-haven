'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Bird,
  Package,
  ShoppingBag,
  Settings,
  MessageCircle,
  CreditCard,
  LogOut,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { UserSession } from '@/types';

export default function OwnerPortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [checking, setChecking] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user && data.user.role === 'ADMIN') {
          setUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const handleOwnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Allow login with either admin password or direct admin email
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@aviary.com',
          password: passcode.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.user) {
        setError('Invalid owner password. Default is: admin123');
        setLoading(false);
        return;
      }

      setUser(data.user);
      router.push('/admin');
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.refresh();
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xs">
        Loading Owner Portal...
      </div>
    );
  }

  // If already logged in as Admin/Owner, show the Quick Action Hub
  if (user && user.role === 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black">Owner Management Console</h1>
                <p className="text-xs text-slate-400">Welcome, {user.name} (Store Owner)</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center space-x-1 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Birds Management */}
            <Link
              href="/admin/birds"
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Bird className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="font-extrabold text-sm text-white mt-3">Manage Pets & Birds</h3>
              <p className="text-xs text-slate-400 mt-1">Add new birds, mark as Sold/Available, update prices.</p>
            </Link>

            {/* Products Management */}
            <Link
              href="/admin/products"
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
              </div>
              <h3 className="font-extrabold text-sm text-white mt-3">Manage Products & Cages</h3>
              <p className="text-xs text-slate-400 mt-1">Update stock availability, prices, food & cages.</p>
            </Link>

            {/* Orders */}
            <Link
              href="/admin/orders"
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <h3 className="font-extrabold text-sm text-white mt-3">Customer Orders</h3>
              <p className="text-xs text-slate-400 mt-1">View recent orders, customer addresses, and order history.</p>
            </Link>

            {/* WhatsApp & Payment Settings */}
            <Link
              href="/admin/content"
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </div>
              <h3 className="font-extrabold text-sm text-white mt-3">WhatsApp & Payment Settings</h3>
              <p className="text-xs text-slate-400 mt-1">Set your WhatsApp number for orders, UPI ID, and store info.</p>
            </Link>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Link
              href="/admin"
              className="flex-1 text-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3.5 rounded-xl transition-all"
            >
              Open Full Admin Dashboard
            </Link>
            <Link
              href="/"
              className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3.5 rounded-xl transition-all"
            >
              Back to Store Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Owner Access Lock Screen
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white">Owner Portal</h1>
          <p className="text-xs text-slate-400">
            Restricted area for store owner to manage pets, products, orders & WhatsApp settings.
          </p>
        </div>

        <form onSubmit={handleOwnerLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Owner Password / PIN</label>
            <div className="relative">
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter owner password (e.g. admin123)"
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                autoFocus
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:bg-slate-700"
          >
            {loading ? 'Authenticating...' : 'Access Owner Console →'}
          </button>
        </form>

        <div className="border-t border-slate-800 pt-4 text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
