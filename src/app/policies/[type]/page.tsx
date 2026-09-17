import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldCheck, Truck, Lock, FileText, ArrowLeft } from 'lucide-react';

export default function PolicyPage({ params }: { params: { type: string } }) {
  const { type } = params;

  let title = 'Store Policy';
  let icon = FileText;
  let content = '';

  if (type === 'live-bird-policy') {
    title = 'Live Bird Purchase & Transit Policy';
    icon = ShieldCheck;
    content = `### Live Animal Sale & Health Guarantee

1. **Pre-Dispatch Vet Screening**: All live birds listed on Feather Haven are hand-raised or nursery-incubated and undergo a 14-day health isolation and de-worming program prior to sale.
2. **Double-Purchase Prevention**: Because individual birds are unique inventory items, our database locks bird availability atomically. Once an order is confirmed, the bird's status changes to 'SOLD' instantly.
3. **Transit & Local Delivery**: Live animal delivery is conducted strictly in ventilated, temperature-regulated travel carriers. Deliveries are scheduled during mild weather hours (early morning or late afternoon).
4. **Store Pickup**: Customers choosing Store Pickup at our MG Road Bengaluru aviary can inspect their bird in person, receive finger-taming tips, and collect starter millet sprays.`;
  } else if (type === 'shipping-policy') {
    title = 'Shipping & Delivery Terms';
    icon = Truck;
    content = `### Delivery Guidelines

1. **Free Delivery**: All orders for cages, seed mixes, and accessories over ₹1,999 qualify for FREE standard delivery across India.
2. **Dispatch Timelines**: Cages and food products are dispatched within 24 hours via express courier partners.
3. **Live Bird Shipping**: Live bird delivery rules are configurable based on PIN code accessibility and climate safety. Contact us via WhatsApp for remote area inquiries.`;
  } else if (type === 'privacy-policy') {
    title = 'Privacy & Data Security Policy';
    icon = Lock;
    content = `### Data Protection

Feather Haven respects customer privacy. We collect only necessary delivery addresses and phone details to fulfill your orders. Customer account passwords are strictly encrypted with bcrypt hashing and never exposed in plain text.`;
  } else {
    notFound();
  }

  const IconComp = icon;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link href="/" className="inline-flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-emerald-600">
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
              <IconComp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-600 uppercase font-extrabold">Official Policy</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{title}</h1>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line pt-4 border-t border-slate-100">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
