import React from 'react';
import { prisma } from '@/lib/prisma';
import { AlertTriangle, CheckCircle2, Package } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminInventoryPage() {
  const lowStockProducts = await prisma.product.findMany({
    where: { stock: { lte: 5 } },
    include: { category: true },
  });

  const availableBirds = await prisma.bird.findMany({
    where: { status: 'AVAILABLE' },
  });

  const soldBirds = await prisma.bird.findMany({
    where: { status: 'SOLD' },
  });

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-slate-800">
        <span className="text-xs font-mono uppercase text-amber-400 font-bold">Inventory Tracker</span>
        <h1 className="text-3xl font-black text-white mt-1">Stock & Animal Inventory</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Low Stock Warnings */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Low Stock Products (&le; 5 units)</span>
          </h3>

          <div className="space-y-3">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white text-sm block">{p.name}</span>
                  <span className="text-amber-300 font-mono">Stock Remaining: {p.stock} units</span>
                </div>
                <Link
                  href="/admin/products"
                  className="bg-amber-500 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl hover:bg-amber-400"
                >
                  Restock
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Live Bird Inventory Status */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Live Bird Tracking Summary</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <span className="text-2xl font-black text-emerald-400 block">{availableBirds.length}</span>
              <span className="text-xs text-slate-300 font-bold">Birds Available</span>
            </div>
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
              <span className="text-2xl font-black text-rose-400 block">{soldBirds.length}</span>
              <span className="text-xs text-slate-300 font-bold">Birds Sold</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
