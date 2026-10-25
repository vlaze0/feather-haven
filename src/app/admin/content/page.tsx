'use client';

import React, { useState, useEffect } from 'react';
import { Sliders, Save, Check, MessageCircle, CreditCard, ShieldCheck } from 'lucide-react';

export default function AdminContentPage() {
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [announcementBar, setAnnouncementBar] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [ownerUPI, setOwnerUPI] = useState('');
  const [ownerUPIName, setOwnerUPIName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [enableCOD, setEnableCOD] = useState(true);
  const [enableUPI, setEnableUPI] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setHeroTitle(data.settings.hero_title || 'Find Your Perfect Feathered Companion');
          setHeroSubtitle(
            data.settings.hero_subtitle ||
              'Healthy, hand-reared budgies & exotic birds, premium cages, organic food, and expert care supplies delivered safely to your doorstep.'
          );
          setAnnouncementBar(
            data.settings.announcement_bar ||
              '🎉 Free express delivery on orders over ₹1,999! Order directly via WhatsApp.'
          );
          setWhatsappNumber(data.settings.whatsapp_number || '919876543210');
          setOwnerUPI(data.settings.owner_upi_id || 'your-upi@upi');
          setOwnerUPIName(data.settings.owner_upi_name || 'Feather Haven Aviary');
          setStoreAddress(data.settings.store_address || 'Jamalpur, Aligarh 202002');
          setEnableCOD(data.settings.enable_cod !== 'false');
          setEnableUPI(data.settings.enable_upi !== 'false');
        }
      });
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        announcement_bar: announcementBar,
        whatsapp_number: whatsappNumber,
        owner_upi_id: ownerUPI,
        owner_upi_name: ownerUPIName,
        store_address: storeAddress,
        enable_cod: String(enableCOD),
        enable_upi: String(enableUPI),
      }),
    });

    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-slate-800">
        <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Owner Management Console</span>
        <h1 className="text-3xl font-black text-white mt-1">Store, WhatsApp & Payment Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure where customer orders are routed on WhatsApp and setup your UPI payment details.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-8 max-w-3xl text-xs">
        {saved && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold rounded-xl flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully! WhatsApp orders and payment info updated.</span>
          </div>
        )}

        {/* 1. WhatsApp Order Routing */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm pb-2 border-b border-slate-800">
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp Order Routing</span>
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">
              Owner's WhatsApp Number for Orders (with country code, no + sign) *
            </label>
            <input
              type="text"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="e.g. 919876543210"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              When a customer completes checkout, the entire order script is pre-filled and sent directly to this WhatsApp number.
            </p>
          </div>
        </div>

        {/* 2. Payment Methods */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sky-400 font-bold text-sm pb-2 border-b border-slate-800">
            <CreditCard className="w-5 h-5" />
            <span>Payment Methods & UPI Configuration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Your UPI ID (GPay/PhonePe/Paytm) *</label>
              <input
                type="text"
                required
                value={ownerUPI}
                onChange={(e) => setOwnerUPI(e.target.value)}
                placeholder="e.g. 9876543210@paytm or name@okaxis"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">UPI Display Name *</label>
              <input
                type="text"
                required
                value={ownerUPIName}
                onChange={(e) => setOwnerUPIName(e.target.value)}
                placeholder="e.g. Feather Haven Aviary"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6 pt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableUPI}
                onChange={(e) => setEnableUPI(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-slate-300 font-semibold">Enable UPI Payments</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableCOD}
                onChange={(e) => setEnableCOD(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-slate-300 font-semibold">Enable Cash on Delivery (COD)</span>
            </label>
          </div>
        </div>

        {/* 3. Homepage & Ticker */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm pb-2 border-b border-slate-800">
            <Sliders className="w-5 h-5" />
            <span>Homepage Content & Store Details</span>
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Homepage Hero Heading *</label>
            <input
              type="text"
              required
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-bold"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Homepage Hero Subtitle *</label>
            <textarea
              rows={2}
              required
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Top Announcement Ticker Bar *</label>
            <input
              type="text"
              required
              value={announcementBar}
              onChange={(e) => setAnnouncementBar(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Store Physical Address *</label>
            <input
              type="text"
              required
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl shadow-lg flex items-center space-x-2 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving Settings...' : 'Save Owner Settings'}</span>
        </button>
      </form>
    </div>
  );
}
