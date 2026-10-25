'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  Store,
  CreditCard,
  Banknote,
  Lock,
  CheckCircle2,
  Copy,
  ArrowLeft,
  AlertCircle,
  MessageCircle,
  Send,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatCurrency, generateWhatsAppLink, generateWhatsAppOrderScript } from '@/lib/utils';

type Step = 'form' | 'upi-payment';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    subtotal,
    discountAmount,
    deliveryCharge,
    totalAmount,
    coupon,
    deliveryMethod,
    setDeliveryMethod,
    clearCart,
    showToast,
  } = useCart();

  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');

  // Settings from Owner Console
  const [ownerPhone, setOwnerPhone] = useState('919876543210');
  const [ownerUPI, setOwnerUPI] = useState('featherhaven@upi');
  const [ownerUPIName, setOwnerUPIName] = useState('Feather Haven Aviary');

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  const [notes, setNotes] = useState('');

  // Fetch Owner Settings (WhatsApp number and UPI details)
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          if (data.settings.whatsapp_number) setOwnerPhone(data.settings.whatsapp_number);
          if (data.settings.owner_upi_id) setOwnerUPI(data.settings.owner_upi_id);
          if (data.settings.owner_upi_name) setOwnerUPIName(data.settings.owner_upi_name);
        }
      })
      .catch(() => {});
  }, []);

  if (cart.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-slate-200 text-center">
          <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 mt-1">Please add birds or products before checkout.</p>
          <Link
            href="/birds"
            className="mt-4 inline-block bg-emerald-600 text-white font-bold text-xs px-6 py-3 rounded-xl"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  // ─── Place order in DB and redirect to WhatsApp ──────────────────────────
  const handlePlaceOrder = async (payStatus: 'PENDING' | 'PAID') => {
    setLoading(true);
    setError(null);

    try {
      const orderItems = cart.map((item) => ({
        type: item.type,
        birdId: item.birdId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        title: item.title,
      }));

      const finalNotes = utrNumber.trim()
        ? `${notes ? notes + ' | ' : ''}UPI UTR/Ref: ${utrNumber.trim()}`
        : notes;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          deliveryMethod,
          address,
          city,
          state,
          pincode,
          couponCode: coupon?.code,
          paymentMethod,
          paymentStatus: payStatus,
          notes: finalNotes,
          items: orderItems,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.order) {
        setError(data.error || 'Failed to place order.');
        setLoading(false);
        return;
      }

      // Generate the WhatsApp order script
      const script = generateWhatsAppOrderScript({
        orderNumber: data.order.orderNumber,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryMethod,
        address,
        city,
        pincode,
        items: cart.map((i) => ({
          title: i.title,
          quantity: i.quantity,
          price: i.unitPrice,
        })),
        subtotal,
        deliveryCharge,
        discountAmount,
        totalAmount,
        paymentMethod,
        notes: finalNotes,
      });

      const whatsappUrl = generateWhatsAppLink(ownerPhone, script);

      // Open WhatsApp in a new tab/app
      window.open(whatsappUrl, '_blank');

      clearCart();
      showToast('Order created! Opening WhatsApp... 🕊️');
      router.push(`/order-success/${data.order.id}`);
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (paymentMethod === 'UPI') {
      setStep('upi-payment');
    } else {
      handlePlaceOrder('PENDING');
    }
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(ownerUPI).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Construct dynamic UPI payment URI
  const upiUri = `upi://pay?pa=${ownerUPI}&pn=${encodeURIComponent(
    ownerUPIName
  )}&am=${totalAmount}&cu=INR&tn=FeatherHaven-Order`;

  const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    upiUri
  )}`;

  // ─── STEP 2: UPI PAYMENT & QR CODE SCREEN ────────────────────────────────
  if (step === 'upi-payment') {
    return (
      <div className="bg-slate-50 min-h-screen py-10">
        <div className="max-w-md mx-auto px-4 space-y-6">
          <button
            onClick={() => setStep('form')}
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Details</span>
          </button>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6 text-center">
            <div>
              <span className="text-[11px] font-mono uppercase text-emerald-600 font-extrabold tracking-wider">
                Step 2 of 2: Scan & Pay
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">Complete UPI Payment</h2>
              <p className="text-xs text-slate-500 mt-1">
                Scan using any UPI app (GPay, PhonePe, Paytm, CRED, BHIM)
              </p>
            </div>

            {/* Total Amount Box */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-0.5">Amount to Pay</p>
              <p className="text-3xl font-black text-emerald-600">{formatCurrency(totalAmount)}</p>
            </div>

            {/* Dynamic QR Code */}
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-sm">
                <img
                  src={dynamicQrUrl}
                  alt="UPI Payment QR Code"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                QR code includes store UPI & exact payable amount
              </p>
            </div>

            {/* UPI ID Copy Section */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <p className="text-xs text-slate-500">Or transfer directly to UPI ID:</p>
              <div className="flex items-center justify-between bg-slate-100 rounded-xl px-4 py-2.5">
                <span className="font-mono font-bold text-slate-900 text-xs truncate mr-2">{ownerUPI}</span>
                <button
                  type="button"
                  onClick={handleCopyUPI}
                  className="text-emerald-600 hover:text-emerald-700 font-bold text-xs flex items-center space-x-1 shrink-0"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Direct UPI App Deep Link */}
            <a
              href={upiUri}
              className="block w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all"
            >
              📱 Tap to Open in UPI App (GPay / PhonePe)
            </a>

            {/* Optional UTR / Reference Number */}
            <div className="text-left space-y-1 pt-2">
              <label className="text-xs font-bold text-slate-700 block">
                UPI Reference / UTR Number (Optional)
              </label>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 423871928371 (12 digits)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <p className="text-[10px] text-slate-400">
                Helps the store owner instantly verify your payment.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Confirm & Send on WhatsApp */}
            <button
              onClick={() => handlePlaceOrder('PAID')}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-4 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 disabled:bg-slate-300"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{loading ? 'Creating Order...' : 'I Have Paid — Send on WhatsApp 💬'}</span>
            </button>

            <p className="text-[10px] text-slate-400">
              Paid to: <strong>{ownerUPIName}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 1: CUSTOMER DETAILS FORM ────────────────────────────────────────
  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Direct Checkout</h1>
          <p className="text-xs text-slate-500 mt-1">
            No registration needed. Enter details and your order script will be sent directly to the store on WhatsApp.
          </p>
        </div>

        <form onSubmit={handleSubmitForm} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Fulfillment Mode */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">1. Delivery Method</h3>
              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('HOME_DELIVERY')}
                  className={`p-4 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                    deliveryMethod === 'HOME_DELIVERY'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="block text-sm font-extrabold">Home Delivery</span>
                    <span className="text-[11px] text-slate-500 font-normal">Climate-controlled transport</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('STORE_PICKUP')}
                  className={`p-4 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                    deliveryMethod === 'STORE_PICKUP'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Store className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="block text-sm font-extrabold">Store Pickup (Free)</span>
                    <span className="text-[11px] text-slate-500 font-normal">MG Road, Bengaluru</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Customer Contact & Address Info */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">2. Contact & Delivery Info</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Md Areeb"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="areeb@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {deliveryMethod === 'HOME_DELIVERY' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Address *</label>
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House/Flat No., Landmark, Street Name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Bengaluru"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Karnataka"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">PIN Code *</label>
                      <input
                        type="text"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="560001"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Special Notes for Owner (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please call before delivery, bird handling preference..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">3. Payment Preference</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                    paymentMethod === 'COD'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="block font-extrabold">Cash on Delivery (COD)</span>
                    <span className="text-[10px] text-slate-500 font-normal">Pay cash when pet/product arrives</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                    paymentMethod === 'UPI'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="block font-extrabold">UPI / QR Code</span>
                    <span className="text-[10px] text-slate-500 font-normal">Scan QR via GPay, PhonePe, Paytm</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-fit space-y-6">
            <h3 className="font-extrabold text-slate-900 text-lg">Selected Products ({cart.length})</h3>

            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="truncate max-w-[200px]">
                    <span className="font-bold text-slate-900 block truncate">{item.title}</span>
                    <span className="text-slate-400">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-black text-slate-900">{formatCurrency(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-4 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-bold text-slate-900">
                  {deliveryCharge === 0 ? 'FREE' : formatCurrency(deliveryCharge)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Payable</span>
                <span className="text-emerald-600">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-4 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 disabled:bg-slate-300"
            >
              <MessageCircle className="w-5 h-5" />
              <span>
                {loading
                  ? 'Processing...'
                  : paymentMethod === 'UPI'
                  ? 'Proceed to UPI Payment & QR Code →'
                  : 'Place Order & Send on WhatsApp 💬'}
              </span>
            </button>

            <div className="text-center text-[11px] text-slate-400 font-medium flex items-center justify-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Direct WhatsApp Order to Store Owner</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
