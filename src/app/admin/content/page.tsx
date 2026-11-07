'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sliders,
  Save,
  Check,
  MessageCircle,
  CreditCard,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  QrCode,
  Upload,
  Trash2,
  RefreshCw,
} from 'lucide-react';

export default function AdminContentPage() {
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [announcementBar, setAnnouncementBar] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [ownerUPI, setOwnerUPI] = useState('');
  const [ownerUPIName, setOwnerUPIName] = useState('');
  const [ownerQRCode, setOwnerQRCode] = useState('');
  const [qrCodeMode, setQrCodeMode] = useState<'dynamic' | 'custom'>('dynamic');
  const [storeAddress, setStoreAddress] = useState('');
  const [enableCOD, setEnableCOD] = useState(true);
  const [enableUPI, setEnableUPI] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Owner Portal PIN state
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinLoading, setPinLoading] = useState(false);
  const [pinSuccess, setPinSuccess] = useState<string | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);

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
          setOwnerQRCode(data.settings.owner_qr_code || '');
          setQrCodeMode(data.settings.qr_code_mode || (data.settings.owner_qr_code ? 'custom' : 'dynamic'));
          setStoreAddress(data.settings.store_address || 'Jamalpur, Aligarh 202002');
          setEnableCOD(data.settings.enable_cod !== 'false');
          setEnableUPI(data.settings.enable_upi !== 'false');
        }
      });
  }, []);

  const handleQrFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setOwnerQRCode(result);
        setQrCodeMode('custom');
      }
    };
    reader.readAsDataURL(file);
  };

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
        owner_qr_code: ownerQRCode,
        qr_code_mode: qrCodeMode,
        store_address: storeAddress,
        enable_cod: String(enableCOD),
        enable_upi: String(enableUPI),
      }),
    });

    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    setPinSuccess(null);

    if (newPin.trim().length < 4) {
      setPinError('New PIN must be at least 4 characters long.');
      return;
    }

    if (newPin !== confirmPin) {
      setPinError('New PIN and Confirm PIN do not match.');
      return;
    }

    setPinLoading(true);
    try {
      const res = await fetch('/api/owner/change-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPin: currentPin.trim(),
          newPin: newPin.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPinError(data.error || 'Failed to update PIN. Please verify your current PIN.');
      } else {
        setPinSuccess('Owner Portal PIN updated successfully! Remember to use your new PIN next time.');
        setCurrentPin('');
        setNewPin('');
        setConfirmPin('');
      }
    } catch {
      setPinError('Connection error while updating PIN. Please try again.');
    } finally {
      setPinLoading(false);
    }
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

          {/* QR Code Customization & Upload Section */}
          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80 space-y-4 mt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <QrCode className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">UPI QR Code Settings</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Customers scan this QR code at checkout to pay
              </span>
            </div>

            {/* Mode Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setQrCodeMode('dynamic')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  qrCodeMode === 'dynamic'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500/30'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4" />
                  <span className="font-bold text-xs text-white">Auto-Generated Dynamic QR</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Generates QR automatically from your UPI ID ({ownerUPI}) with the customer's exact order amount.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setQrCodeMode('custom')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  qrCodeMode === 'custom'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500/30'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span className="font-bold text-xs text-white">Custom Store QR Code Image</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Upload your own GPay, PhonePe, Paytm, or BharatPe shop standee QR code image.
                </p>
              </button>
            </div>

            {/* If Custom Mode: upload or input */}
            {qrCodeMode === 'custom' && (
              <div className="space-y-3 pt-2 border-t border-slate-700/60">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleQrFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload QR Code Image from Device</span>
                  </button>

                  <span className="text-slate-500 text-[11px] font-medium">Or paste an Image URL / Path:</span>
                </div>

                <input
                  type="text"
                  value={ownerQRCode}
                  onChange={(e) => setOwnerQRCode(e.target.value)}
                  placeholder="e.g. /images/qr.png or https://... (or click Upload above)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-[11px]"
                />
              </div>
            )}

            {/* QR Code Live Preview */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="p-2 bg-white rounded-xl shadow-sm shrink-0 border border-slate-300">
                <img
                  src={
                    qrCodeMode === 'custom' && ownerQRCode.trim()
                      ? ownerQRCode
                      : `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                          `upi://pay?pa=${ownerUPI}&pn=${encodeURIComponent(ownerUPIName)}&cu=INR`
                        )}`
                  }
                  alt="Live QR Preview"
                  className="w-28 h-28 object-contain rounded-lg"
                />
              </div>
              <div className="space-y-1 text-center sm:text-left flex-1">
                <div className="flex items-center space-x-2 justify-center sm:justify-start">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      qrCodeMode === 'custom' && ownerQRCode.trim()
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {qrCodeMode === 'custom' && ownerQRCode.trim()
                      ? 'Custom Store QR Active'
                      : 'Auto-Generated QR Active'}
                  </span>
                  {ownerQRCode && (
                    <button
                      type="button"
                      onClick={() => {
                        setOwnerQRCode('');
                        setQrCodeMode('dynamic');
                      }}
                      className="text-rose-400 hover:text-rose-300 text-[11px] flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Custom QR</span>
                    </button>
                  )}
                </div>
                <p className="text-white font-bold text-xs mt-1">Live Customer QR Preview</p>
                <p className="text-slate-400 text-[11px]">
                  You can scan this QR code right now with your phone camera or payment app (Google Pay, PhonePe, Paytm) to test it before saving!
                </p>
              </div>
            </div>
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

      {/* 4. Security & Owner Portal PIN */}
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6 max-w-3xl text-xs">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm pb-2 border-b border-slate-800">
          <KeyRound className="w-5 h-5" />
          <span>Security: Owner Portal Access PIN</span>
        </div>
        <p className="text-slate-400">
          Change the passcode required to access the Owner Portal (<code className="text-emerald-400 font-mono">/owner</code> and <code className="text-emerald-400 font-mono">/admin</code>). Default initial PIN is <code className="text-amber-400 font-bold">admin123</code>.
        </p>

        {pinSuccess && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold rounded-xl flex items-center space-x-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{pinSuccess}</span>
          </div>
        )}

        {pinError && (
          <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{pinError}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePin} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Current PIN *</label>
              <input
                type="password"
                required
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
                placeholder="Current PIN"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">New PIN *</label>
              <input
                type="password"
                required
                minLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Min 4 characters"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Confirm New PIN *</label>
              <input
                type="password"
                required
                minLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Repeat new PIN"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pinLoading}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl shadow-lg flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{pinLoading ? 'Updating PIN...' : 'Update Owner PIN'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
