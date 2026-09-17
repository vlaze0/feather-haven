import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Banknote, ShoppingBag, Bird, AlertTriangle, Users, ArrowUpRight, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  // Aggregate Database Statistics
  const totalOrdersCount = await prisma.order.count();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { orderItems: true },
  });

  const totalRevenueResult = await prisma.order.aggregate({
    _sum: { totalAmount: true },
  });
  const totalRevenue = totalRevenueResult._sum.totalAmount || 0;

  const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });

  const availableBirdsCount = await prisma.bird.count({ where: { status: 'AVAILABLE' } });
  const soldBirdsCount = await prisma.bird.count({ where: { status: 'SOLD' } });

  const lowStockProducts = await prisma.product.findMany({
    where: { stock: { lte: 5 } },
  });

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Admin Console</span>
          <h1 className="text-3xl font-black text-white mt-1">Dashboard Overview</h1>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/birds"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition-colors"
          >
            + Add New Bird
          </Link>
          <Link
            href="/admin/products"
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Revenue</span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{formatCurrency(totalRevenue)}</p>
          <span className="text-[11px] text-emerald-400 font-medium flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            Live store revenue
          </span>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Orders</span>
            <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-2xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{totalOrdersCount}</p>
          <span className="text-[11px] text-slate-400 font-medium">{totalCustomers} Registered Customers</span>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Live Aviary Birds</span>
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl">
              <Bird className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-black text-white">{availableBirdsCount}</p>
            <span className="text-xs text-slate-400">Available ({soldBirdsCount} Sold)</span>
          </div>
          <span className="text-[11px] text-amber-400 font-medium">Individual bird protection active</span>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Low Stock Warnings</span>
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-2xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{lowStockProducts.length}</p>
          <span className="text-[11px] text-rose-400 font-medium">Items under 5 units</span>
        </div>
      </div>

      {/* Grid: Low Stock Alert Warning Box & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Low Stock Warning Feed */}
        <div className="lg:col-span-5 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Low Stock Inventory Alerts</span>
          </h3>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">All products have healthy inventory levels!</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{p.name}</span>
                    <span className="text-[10px] text-amber-300">Only {p.stock} units remaining</span>
                  </div>
                  <Link
                    href={`/admin/products?edit=${p.id}`}
                    className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-lg hover:bg-amber-400"
                  >
                    Restock
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders Feed */}
        <div className="lg:col-span-7 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white">Recent Customer Orders</h3>
            <Link href="/admin/orders" className="text-xs font-bold text-emerald-400 hover:underline">
              View All Orders
            </Link>
          </div>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div key={ord.id} className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-white">{ord.orderNumber}</span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                      {ord.orderStatus}
                    </span>
                  </div>
                  <span className="text-slate-400 block mt-1">{ord.customerName} • {ord.orderItems.length} items</span>
                </div>

                <div className="text-right">
                  <span className="font-black text-white text-sm block">{formatCurrency(ord.totalAmount)}</span>
                  <span className="text-[10px] text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
