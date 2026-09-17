'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    deliveryCharge,
    totalAmount,
    coupon,
    applyCoupon,
    removeCoupon,
    deliveryMethod,
    setDeliveryMethod,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
        <div className="bg-white max-w-md w-full p-10 rounded-3xl border border-slate-200 text-center shadow-lg">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 mt-2">
            You haven't added any birds, cages, or food products to your shopping cart yet.
          </p>
          <Link
            href="/birds"
            className="mt-6 inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl shadow-md transition-all"
          >
            Explore Available Birds & Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Shopping Cart</h1>
          <p className="text-xs text-slate-500 mt-1">Review your selected birds and supplies before checkout.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Table */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden relative shrink-0 border border-slate-200">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-600">
                        {item.type === 'bird' ? 'Unique Live Bird' : 'Store Item'}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-sm line-clamp-1">{item.title}</h3>
                      <span className="text-xs font-bold text-slate-900 mt-1 block">
                        {formatCurrency(item.unitPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
                    {item.type === 'bird' ? (
                      <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-xl">
                        Single Bird (Qty: 1)
                      </span>
                    ) : (
                      <div className="flex items-center space-x-3 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-slate-600 hover:text-slate-900"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-extrabold text-slate-900 w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-slate-600 hover:text-slate-900"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <span className="text-sm font-black text-slate-900 min-w-[80px] text-right">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-2"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-fit space-y-6">
            <h3 className="font-extrabold text-slate-900 text-lg">Order Summary</h3>

            {/* Delivery Method Choice */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">Delivery Option</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => setDeliveryMethod('HOME_DELIVERY')}
                  className={`py-2.5 px-3 rounded-xl border transition-all ${
                    deliveryMethod === 'HOME_DELIVERY'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Home Delivery
                </button>
                <button
                  onClick={() => setDeliveryMethod('STORE_PICKUP')}
                  className={`py-2.5 px-3 rounded-xl border transition-all ${
                    deliveryMethod === 'STORE_PICKUP'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Store Pickup
                </button>
              </div>
            </div>

            {/* Coupon Application */}
            {coupon ? (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span>Coupon '{coupon.code}' applied</span>
                </div>
                <button onClick={removeCoupon} className="text-rose-600 hover:underline font-bold text-[11px]">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon Code"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Apply
                </button>
              </form>
            )}
            {couponError && <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>}

            {/* Financial Breakdown */}
            <div className="space-y-2 text-xs text-slate-600 pt-4 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
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
                <span>Total Amount</span>
                <span className="text-emerald-600">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-4 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
