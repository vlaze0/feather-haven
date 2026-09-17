import React from 'react';
import { prisma } from '@/lib/prisma';
import { Users, Mail, Phone, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const revalidate = 0;

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    include: {
      orders: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-slate-800">
        <span className="text-xs font-mono uppercase text-sky-400 font-bold">User Directory</span>
        <h1 className="text-3xl font-black text-white mt-1">Customer Management</h1>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-700">
            <tr>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Total Orders</th>
              <th className="p-4">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-medium">
            {customers.map((c) => {
              const totalSpent = c.orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
              return (
                <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-white text-sm">{c.name}</td>
                  <td className="p-4 text-slate-300">{c.email}</td>
                  <td className="p-4 text-slate-400">{c.phone || '—'}</td>
                  <td className="p-4 font-extrabold text-white">{c.orders.length}</td>
                  <td className="p-4 font-black text-emerald-400 text-sm">{formatCurrency(totalSpent)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
