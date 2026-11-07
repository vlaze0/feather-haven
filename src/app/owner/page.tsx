'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Bird,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  ArrowRight,
  Check,
  X,
} from 'lucide-react';
import { UserSession } from '@/types';

export default function OwnerPortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [checking, setChecking] = useState(true);

  // Login state
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Tab on lock screen: 'login' | 'change-pin'
  const [lockTab, setLockTab] = useState<'login' | 'change-pin'>('login');

  // Change PIN modal / state
  const [showPinModal, setShowPinModal] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinSuccess, setPinSuccess] = useState<string | null>(null);
  const [pinLoading, setPinLoading] = useState(false);

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

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    setPinSuccess(null);

    if (newPin.trim().length < 4) {
      setPinError('New PIN must be at least 4 characters long.');
      return;
    }

    if (newPin !== confirmPin) {
      setPinError('New PIN and Confirm PIN do not match.');
      return;
    }

    setPinLoading(true);

    try {
      const res = await fetch('/api/owner/change-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPin: currentPin.trim(),
          newPin: newPin.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPinError(data.error || 'Failed to update PIN.');
        setPinLoading(false);
        return;
      }

      setPinSuccess(data.message || 'Owner PIN changed successfully!');
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      setPinLoading(false);

      if (lockTab === 'change-pin') {
        setTimeout(() => {
          setLockTab('login');
          setPinSuccess(null);
        }, 2500);
      }
    } catch {
      setPinError('Failed to connect to server. Please try again.');
      setPinLoading(false);
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

  // ───────────────────────────────────────────────────────────────────────────
  // LOGGED IN OWNER VIEW
  // ───────────────────────────────────────────────────────────────────────────
  if (user && user.role === 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
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
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPinModal(true)}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1.5 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 transition-colors"
                title="Change Owner PIN"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Change PIN</span>
              </button>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center space-x-1 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Quick Hub Grid */}
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

          {/* Change PIN Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">Owner Security PIN</h4>
                <p className="text-[11px] text-slate-400">Change your secret PIN used to unlock this Owner Portal.</p>
              </div>
            </div>
            <button
              onClick={() => setShowPinModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
            >
              Change PIN
            </button>
          </div>

          {/* Bottom Navigation CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
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

        {/* Change PIN Modal */}
        {showPinModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-amber-400">
                  <KeyRound className="w-5 h-5" />
                  <h3 className="font-black text-base text-white">Change Owner PIN</h3>
                </div>
                <button
                  onClick={() => {
                    setShowPinModal(false);
                    setPinError(null);
                    setPinSuccess(null);
                  }}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {pinSuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs rounded-xl font-bold flex items-center space-x-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{pinSuccess}</span>
                </div>
              )}

              {pinError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl font-medium">
                  {pinError}
                </div>
              )}

              <form onSubmit={handleChangePin} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Current PIN / Password *</label>
                  <input
                    type="password"
                    required
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value)}
                    placeholder="Enter current PIN (e.g. admin123)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">New Owner PIN / Password *</label>
                  <input
                    type="password"
                    required
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Enter new PIN (min. 4 characters)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Confirm New PIN *</label>
                  <input
                    type="password"
                    required
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="Re-enter new PIN"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={pinLoading}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl transition-all disabled:bg-slate-700"
                  >
                    {pinLoading ? 'Updating PIN...' : 'Save New PIN'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPinModal(false);
                      setPinError(null);
                      setPinSuccess(null);
                    }}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // OWNER ACCESS LOCK SCREEN
  // ───────────────────────────────────────────────────────────────────────────
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

        {/* Tab Selector: Access Portal vs Change PIN */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setLockTab('login');
              setError(null);
              setPinError(null);
              setPinSuccess(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              lockTab === 'login'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Access Portal
          </button>
          <button
            type="button"
            onClick={() => {
              setLockTab('change-pin');
              setError(null);
              setPinError(null);
              setPinSuccess(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              lockTab === 'change-pin'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Change PIN
          </button>
        </div>

        {/* TAB 1: ACCESS PORTAL (LOGIN) */}
        {lockTab === 'login' && (
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

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setLockTab('change-pin')}
                className="text-xs text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center space-x-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Want to change your owner PIN? Tap here</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: CHANGE PIN */}
        {lockTab === 'change-pin' && (
          <form onSubmit={handleChangePin} className="space-y-4 text-xs">
            {pinSuccess && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs rounded-xl font-bold flex items-center space-x-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{pinSuccess}</span>
              </div>
            )}

            {pinError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl font-medium">
                {pinError}
              </div>
            )}

            <div>
              <label className="text-slate-300 font-bold block mb-1">Current PIN / Password *</label>
              <input
                type="password"
                required
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
                placeholder="Enter current PIN (default: admin123)"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
                autoFocus
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">New PIN / Password *</label>
              <input
                type="password"
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Choose a new PIN (e.g. 5566 or secret)"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Confirm New PIN *</label>
              <input
                type="password"
                required
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Re-enter your new PIN"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={pinLoading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:bg-slate-700"
            >
              {pinLoading ? 'Updating...' : 'Update Owner PIN'}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setLockTab('login')}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}

        <div className="border-t border-slate-800 pt-4 text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
