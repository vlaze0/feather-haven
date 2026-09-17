'use client';

import React, { useState, useEffect } from 'react';
import { Sliders, Save, Check } from 'lucide-react';

export default function AdminContentPage() {
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [announcementBar, setAnnouncementBar] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
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
              '🎉 Free express delivery on orders over ₹1,999! Use coupon WELCOME10 for 10% OFF.'
          );
          setWhatsappNumber(data.settings.whatsapp_number || '919876543210');
          setStoreAddress(
            data.settings.store_address || 'Shop #14, Royal Palm Arcade, MG Road, Bengaluru, Karnataka 560001'
          );
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
        store_address: storeAddress,
      }),
    });

    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-slate-800">
        <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Dynamic Content Engine</span>
        <h1 className="text-3xl font-black text-white mt-1">Homepage & Site Settings</h1>
      </div>

      <form onSubmit={handleSaveSettings} className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6 max-w-3xl text-xs">
        {saved && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold rounded-xl flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully! Homepage reflects your changes dynamically.</span>
          </div>
        )}

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
            rows={3}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-slate-300 font-bold block mb-1">WhatsApp Support Number (Country Code) *</label>
            <input
              type="text"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="919876543210"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Store Address *</label>
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
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl shadow-lg flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </form>
    </div>
  );
}
