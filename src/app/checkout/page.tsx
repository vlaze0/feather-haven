'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatCurrency } from '@/lib/utils';

// ─── Your UPI details — update these ───────────────────────────────────────
const UPI_ID = 'your-upi@upi'; // ← Replace with your actual UPI ID
const UPI_NAME = 'Feather Haven'; // ← Your name / shop name
const QR_IMAGE_PATH = '/images/upi-qr.png'; // ← QR code image you'll upload to public/images/

// ─── Steps ──────────────────────────────────────────────────────────────────
type Step = 'form' | 'upi-payment' | 'upi-confirm';

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

  // ─── Place order in DB ──────────────────────────────────────────────────
  const placeOrder = async (payStatus: 'PENDING' | 'PAID') => {
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
          notes,
          items: orderItems,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.order) {
        setError(data.error || 'Failed to place order.');
        setLoading(false);
        return;
      }

      clearCart();
      showToast('Order placed successfully! 🕊️');
      router.push(`/order-success/${data.order.id}`);
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  // ─── Form submit ─────────────────────────────────────────────────────────
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (paymentMethod === 'UPI') {
      // Go to UPI QR step — don't place order yet
      setStep('upi-payment');
    } else {
      // COD — place order immediately
      placeOrder('PENDING');
    }
  };

  // ─── Copy UPI ID ─────────────────────────────────────────────────────────
  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ─── UPI Payment Screen ──────────────────────────────────────────────────
  if (step === 'upi-payment') {
    return (
      <div className="bg-slate-50 min-h-screen py-10">
        <div className="max-w-md mx-auto px-4 space-y-6">
          {/* Back */}
          <button
            onClick={() => setStep('form')}
            className="flex items-center space-x-1 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Details</span>
          </button>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5 text-center">
            <div>
              <span className="text-xs font-mono uppercase text-emerald-600 font-extrabold">Step 2 of 2</span>
              <h2 className="text-xl font-black text-slate-900 mt-1">Complete UPI Payment</h2>
              <p className="text-xs text-slate-500 mt-1">
                Pay <span className="font-bold text-emerald-600">{formatCurrency(totalAmount)}</span> using any UPI app
              </p>
            </div>

            {/* Amount box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <p className="text-xs text-slate-500 mb-1">Total Amount to Pay</p>
              <p className="text-3xl font-black text-emerald-600">{formatCurrency(totalAmount)}</p>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative w-48 h-48 border-4 border-emerald-600 rounded-2xl overflow-hidden bg-white">
                <Image
                  src={QR_IMAGE_PATH}
                  alt="UPI QR Code"
                  fill
                  className="object-contain p-1"
                  onError={(e) => {
                    // Show placeholder if QR not uploaded yet
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {/* Fallback placeholder */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 text-xs font-medium p-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg mb-2 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-slate-400" />
                  </div>
                  <span className="text-center text-[10px] leading-tight text-slate-400">
                    QR Code will appear here once uploaded
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500">Scan with GPay, PhonePe, Paytm or any UPI app</p>
            </div>

            {/* Or pay via UPI ID */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500 mb-2">Or pay directly to UPI ID</p>
              <div className="flex items-center justify-center space-x-2 bg-slate-100 rounded-xl px-4 py-2.5">
                <span className="font-mono font-bold text-slate-900 text-sm">{UPI_ID}</span>
                <button
                  onClick={handleCopyUPI}
                  className="text-emerald-600 hover:text-emerald-700 transition-colors"
                  title="Copy UPI ID"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-xs text-emerald-600 font-medium mt-1">✓ Copied to clipboard!</p>
              )}
            </div>

            {/* UPI deep link — opens GPay/PhonePe directly */}
            <a
              href={`upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${totalAmount}&cu=INR&tn=FeatherHaven-Order`}
              className="block w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all"
            >
              Open UPI App to Pay
            </a>

            {/* Warning */}
            <div className="flex items-start space-x-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-left">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 font-medium">
                Only tap "I Have Paid" after your payment is successfully completed. Orders without payment will be cancelled.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Confirm payment button */}
            <button
              onClick={() => placeOrder('PAID')}
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:bg-slate-300"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Confirming...' : 'I Have Paid — Confirm Order'}</span>
            </button>

            <p className="text-[10px] text-slate-400">
              Paid to: <strong>{UPI_NAME}</strong> ({UPI_ID})
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Checkout Form ──────────────────────────────────────────────────
  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Checkout</h1>
          <p className="text-xs text-slate-500 mt-1">Complete your customer details and payment preference.</p>
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
              <h3 className="font-extrabold text-slate-900 text-base">2. Contact & Address Info</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  placeholder="rahul@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {deliveryMethod === 'HOME_DELIVERY' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Street Address *</label>
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House/Flat No., Building, Street Name"
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Order Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions for bird handling or delivery time..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">3. Payment Option</h3>

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
                    <span className="text-[10px] text-slate-500 font-normal">Pay when your order arrives</span>
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
                    <span className="text-[10px] text-slate-500 font-normal">GPay, PhonePe, Paytm</span>
                  </div>
                </button>
              </div>

              {paymentMethod === 'UPI' && (
                <div className="flex items-start space-x-2 bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-blue-800 font-medium">
                    After clicking "Proceed to Payment", you'll see our QR code. Scan & pay, then confirm your payment to complete the order.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-fit space-y-6">
            <h3 className="font-extrabold text-slate-900 text-lg">Items in Order ({cart.length})</h3>

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
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-4 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 disabled:bg-slate-300"
            >
              <Lock className="w-4 h-4" />
              <span>
                {loading
                  ? 'Processing...'
                  : paymentMethod === 'UPI'
                  ? 'Proceed to Payment →'
                  : 'Confirm & Place Order'}
              </span>
            </button>

            <div className="text-center text-[11px] text-slate-400 font-medium flex items-center justify-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Encrypted SSL & Atomic Inventory Protection</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
