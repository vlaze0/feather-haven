'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Bird,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  LogOut,
  PackageCheck,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { UserSession } from '@/types';
import DashboardIcon from '@/components/ui/DashboardIcon';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { cart, wishlist } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<UserSession | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Fetch session user
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/birds?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setUserMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <>
      {/* 1. Top Announcement Bar */}
      <div className="bg-slate-900 text-white text-xs py-2.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex items-center space-x-2 text-emerald-400 font-medium truncate">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>🎉 Free Delivery on Orders Above ₹1,999! Use coupon <strong className="text-yellow-300">WELCOME10</strong> for 10% OFF</span>
          </div>
        </div>
      </div>

      {/* 2. Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
            : 'bg-white py-4 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Bird className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight block">
                Feather<span className="text-emerald-600">Haven</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase block -mt-1">
                Aviary & Pet Shop
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              href="/birds"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-1 ${
                pathname.startsWith('/birds')
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              <span>Birds</span>
              <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                Live
              </span>
            </Link>
            <Link
              href="/food"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                pathname.startsWith('/food')
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              Bird Food
            </Link>
            <Link
              href="/accessories"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                pathname.startsWith('/accessories') || pathname.startsWith('/cages')
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              Accessories & Cages
            </Link>
            <Link
              href="/customizer"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                pathname.startsWith('/customizer')
                  ? 'bg-amber-50 text-amber-800 font-bold'
                  : 'text-slate-700 hover:text-amber-600 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
              <span>Customizer</span>
              <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full font-extrabold uppercase">
                App
              </span>
            </Link>
            <Link
              href="/about"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                pathname === '/about'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                pathname === '/contact'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Icon Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Search Birds & Products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dashboard Icon */}
            <Link
              href={user?.role === 'ADMIN' ? '/admin' : '/account'}
              className={`p-2.5 rounded-xl transition-colors flex items-center space-x-1.5 ${
                pathname.startsWith('/admin') || pathname.startsWith('/account')
                  ? 'bg-emerald-50 text-emerald-700 font-bold'
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-100'
              }`}
              title={user?.role === 'ADMIN' ? 'Admin Dashboard' : 'My Dashboard'}
            >
              <DashboardIcon badge={user?.role === 'ADMIN'} />
              <span className="hidden xl:inline text-xs font-semibold text-slate-800">
                Dashboard
              </span>
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2.5 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors flex items-center space-x-1.5 bg-slate-100"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <span className="hidden sm:inline text-xs font-semibold text-slate-800">
                Cart
              </span>
              {totalCartCount > 0 && (
                <span className="bg-emerald-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* Account Dropdown */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-1.5 bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-medium hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <UserIcon className="w-4 h-4 text-emerald-400" />
                  <span className="max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-1.5 bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}

              {/* Account Dropdown Menu */}
              {userMenuOpen && user && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    href="/account"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-600 font-medium"
                  >
                    <PackageCheck className="w-4 h-4 text-slate-400" />
                    <span>My Orders & Profile</span>
                  </Link>

                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-xs text-emerald-700 hover:bg-emerald-50 font-bold"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center space-x-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-emerald-600 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2">
                  <Bird className="w-6 h-6 text-emerald-600" />
                  <span className="font-extrabold text-slate-900 text-lg">FeatherHaven</span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-6 space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-slate-800 rounded-xl hover:bg-slate-50"
                >
                  Home
                </Link>
                <Link
                  href="/birds"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-xl"
                >
                  <span>Birds Marketplace</span>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">
                    Available
                  </span>
                </Link>
                <Link
                  href="/food"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-slate-800 rounded-xl hover:bg-slate-50"
                >
                  Bird Food
                </Link>
                <Link
                  href="/accessories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-slate-800 rounded-xl hover:bg-slate-50"
                >
                  Accessories & Cages
                </Link>
                <Link
                  href="/customizer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 text-sm font-extrabold text-amber-900 bg-amber-50/80 border border-amber-200/60 rounded-xl"
                >
                  <span className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    <span>Customizer Studio</span>
                  </span>
                  <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase">
                    Build
                  </span>
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-slate-800 rounded-xl hover:bg-slate-50"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-slate-800 rounded-xl hover:bg-slate-50"
                >
                  Contact
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              {user ? (
                <div className="space-y-2">
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full block text-center py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    My Profile & Orders
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full block text-center py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block text-center py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-md"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Search className="w-5 h-5 text-emerald-600" />
                <span>Search Feather Haven Store</span>
              </h3>
              <button onClick={() => setSearchOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Try 'blue budgie', 'bird cage', 'millet', 'nesting box'..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-4 pr-12 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 bg-emerald-600 text-white px-4 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-4">
              <p className="text-xs text-slate-400 font-semibold mb-2">Popular Search Terms:</p>
              <div className="flex flex-wrap gap-2">
                {['Sky Blue Budgie', 'Lutino Parakeet', 'Bird Cage', 'Golden Millet', 'Cuttlefish Bone', 'Lovebird'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        router.push(`/birds?search=${encodeURIComponent(term)}`);
                        setSearchOpen(false);
                      }}
                      className="bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 px-3 py-1 rounded-xl text-xs font-medium transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
