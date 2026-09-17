'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, Clock, Truck, Filter, RefreshCw } from 'lucide-react';
import { OrderRecord } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders?status=${statusFilter}`);
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderStatus: newStatus }),
    });
    fetchOrders();
  };

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Fulfillment Portal</span>
          <h1 className="text-3xl font-black text-white mt-1">Customer Orders Management</h1>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          {['ALL', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 text-xs">
              <div>
                <span className="font-mono font-black text-white text-base">{order.orderNumber}</span>
                <span className="text-slate-400 block mt-0.5">
                  Placed by <strong className="text-white">{order.customerName}</strong> ({order.customerPhone}) • {order.customerEmail}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Address: {order.address}, {order.city}, {order.state} - {order.pincode}
                </span>
              </div>

              <div className="flex flex-col md:items-end gap-2">
                <span className="font-black text-white text-lg">{formatCurrency(order.totalAmount)}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-400 font-mono">Status:</span>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-extrabold text-emerald-400 focus:outline-none"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PREPARING">PREPARING</option>
                    <option value="READY_FOR_PICKUP">READY_FOR_PICKUP</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-1.5 text-xs text-slate-300">
              <span className="font-bold text-slate-400 block text-[11px] uppercase">Order Items:</span>
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex justify-between font-medium pl-2">
                  <span>• {item.title} (x{item.quantity})</span>
                  <span className="font-bold text-white">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
