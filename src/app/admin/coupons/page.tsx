'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Check } from 'lucide-react';
import { CouponItem } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [value, setValue] = useState('10');
  const [minOrderAmount, setMinOrderAmount] = useState('500');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const res = await fetch('/api/coupons');
    const data = await res.json();
    if (data.coupons) setCoupons(data.coupons);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !value) return;

    await fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        type,
        value: parseFloat(value),
        minOrderAmount: parseFloat(minOrderAmount),
      }),
    });

    setCode('');
    fetchCoupons();
  };

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-slate-800">
        <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Promotions</span>
        <h1 className="text-3xl font-black text-white mt-1">Discount Coupons</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Coupon Form */}
        <div className="lg:col-span-5 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-extrabold text-white">Create New Coupon Code</h3>

          <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. WELCOME10"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white uppercase font-mono font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Discount Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                >
                  <option value="PERCENTAGE">PERCENTAGE (%)</option>
                  <option value="FIXED">FIXED (₹)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Value *</label>
                <input
                  type="number"
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Min Order Amount (₹)</label>
              <input
                type="number"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg"
            >
              Save Coupon
            </button>
          </form>
        </div>

        {/* Coupons List Table */}
        <div className="lg:col-span-7 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-extrabold text-white">Active Store Coupons</h3>

          <div className="space-y-3">
            {coupons.map((c) => (
              <div key={c.id} className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-black text-emerald-400 text-base block">{c.code}</span>
                  <span className="text-slate-300">
                    {c.type === 'PERCENTAGE' ? `${c.value}% OFF` : `₹${c.value} OFF`} • Min Order: {formatCurrency(c.minOrderAmount)}
                  </span>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
