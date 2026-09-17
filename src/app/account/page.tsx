'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, PackageCheck, Clock, CheckCircle2, Truck, AlertCircle, LogOut, ArrowRight } from 'lucide-react';
import { UserSession, OrderRecord } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data?.user) {
          router.push('/login');
        } else {
          setUser(data.user);
          fetchOrders();
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Card Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-emerald-500 text-slate-950 font-black text-2xl rounded-2xl flex items-center justify-center shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Customer Portal</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
              <p className="text-xs text-slate-300">{user.email} • {user.phone || 'No phone'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors"
              >
                Open Admin Console
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Previous Orders & Status Tracker */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center space-x-2">
            <PackageCheck className="w-6 h-6 text-emerald-600" />
            <span>Order History & Track Shipments ({orders.length})</span>
          </h2>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
              <PackageCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No previous orders found</h3>
              <p className="text-xs text-slate-500 mt-1">Place your first bird or supply order today!</p>
              <Link
                href="/birds"
                className="mt-4 inline-block bg-emerald-600 text-white font-bold text-xs px-6 py-3 rounded-xl"
              >
                Browse Birds & Supplies
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                  {/* Top order bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2 text-xs">
                    <div>
                      <span className="font-mono font-extrabold text-slate-900 text-sm">{order.orderNumber}</span>
                      <span className="text-slate-400 block mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="bg-emerald-50 text-emerald-800 font-extrabold px-3 py-1 rounded-full uppercase text-[10px]">
                        Status: {order.orderStatus}
                      </span>
                      <span className="font-black text-slate-900 text-base">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items list */}
                  <div className="space-y-2">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs font-medium text-slate-700">
                        <span>• {item.title} (x{item.quantity})</span>
                        <span className="font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Status Progress Steps */}
                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 block mb-2">Live Fulfillment Progress:</span>
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 relative">
                      <div className="flex items-center space-x-1 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmed</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${['PREPARING', 'READY_FOR_PICKUP', 'SHIPPED', 'DELIVERED'].includes(order.orderStatus) ? 'text-emerald-600' : 'text-slate-300'}`}>
                        <Clock className="w-4 h-4" />
                        <span>Preparing</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${['SHIPPED', 'DELIVERED'].includes(order.orderStatus) ? 'text-emerald-600' : 'text-slate-300'}`}>
                        <Truck className="w-4 h-4" />
                        <span>Shipped</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${order.orderStatus === 'DELIVERED' ? 'text-emerald-600' : 'text-slate-300'}`}>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
