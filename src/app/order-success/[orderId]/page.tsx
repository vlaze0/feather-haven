import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CheckCircle2, MessageCircle, ArrowRight, Truck, Store, Clock, Copy, Send } from 'lucide-react';
import { formatCurrency, generateWhatsAppLink, generateWhatsAppOrderScript } from '@/lib/utils';

export const revalidate = 0;

export default async function OrderSuccessPage({ params }: { params: { orderId: string } }) {
  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: params.orderId }, { orderNumber: params.orderId }],
    },
    include: {
      orderItems: true,
    },
  });

  if (!order) {
    notFound();
  }

  // Fetch owner's WhatsApp number from settings
  let ownerPhone = '919876543210';
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'whatsapp_number' },
    });
    if (setting?.value) ownerPhone = setting.value;
  } catch {}

  // Generate full order script for WhatsApp
  const whatsappScript = generateWhatsAppOrderScript({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    deliveryMethod: order.deliveryMethod,
    address: order.address,
    city: order.city,
    pincode: order.pincode,
    items: order.orderItems.map((i) => ({
      title: i.title,
      quantity: i.quantity,
      price: i.price,
    })),
    subtotal: order.subtotal,
    deliveryCharge: order.deliveryCharge,
    discountAmount: order.discountAmount,
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod,
    notes: order.notes || undefined,
  });

  const whatsappLink = generateWhatsAppLink(ownerPhone, whatsappScript);

  const isUPI = order.paymentMethod === 'UPI';
  const isPaid = order.paymentStatus === 'PAID';

  return (
    <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl space-y-6 text-center sm:text-left">
        {/* Success Icon Header */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
              isPaid ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-emerald-600 font-extrabold">Order Created!</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Thank You for Your Order 🎉</h1>
            <p className="text-xs text-slate-500 mt-1">
              Order Number: <strong className="text-slate-900 font-mono">#{order.orderNumber}</strong>
            </p>
          </div>
        </div>

        {/* WhatsApp Send Action Hero Box */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-4">
          <div className="flex items-center space-x-2 text-emerald-100 text-xs font-black uppercase tracking-wider">
            <MessageCircle className="w-4 h-4" />
            <span>Next Step: Send Order to Owner on WhatsApp</span>
          </div>
          <p className="text-sm font-semibold text-emerald-50 leading-relaxed">
            Your order script is pre-written! Tap the button below to open WhatsApp and send your order details directly to the store owner for confirmation and live tracking.
          </p>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white hover:bg-emerald-50 text-slate-950 font-black text-sm py-4 px-6 rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 group"
          >
            <Send className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            <span>Send Order via WhatsApp to Owner</span>
          </a>
        </div>

        {/* Payment status banner */}
        {isUPI && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
            <p className="text-sm font-bold text-blue-900">💳 Payment Method: UPI / QR Code</p>
            <p className="text-xs text-blue-700 mt-0.5">
              {isPaid
                ? 'Your payment is submitted. The owner will verify the transaction upon receiving your WhatsApp message.'
                : 'Please send your payment screenshot or UPI transaction ID to the owner on WhatsApp.'}
            </p>
          </div>
        )}
        {!isUPI && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
            <p className="text-sm font-bold text-amber-900">💵 Payment Method: Cash on Delivery (COD)</p>
            <p className="text-xs text-amber-700 mt-0.5">Please keep the cash ready at the time of delivery.</p>
          </div>
        )}

        {/* Order Details Receipt Box */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="font-bold text-slate-700">Customer Name</span>
            <span className="font-extrabold text-slate-900">{order.customerName}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="font-bold text-slate-700">Phone Number</span>
            <span className="font-extrabold text-slate-900">{order.customerPhone}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="font-bold text-slate-700">Delivery Method</span>
            <span className="font-extrabold text-slate-900 flex items-center space-x-1">
              {order.deliveryMethod === 'STORE_PICKUP' ? (
                <>
                  <Store className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Store Pickup (MG Road Bengaluru)</span>
                </>
              ) : (
                <>
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Home Delivery ({order.city})</span>
                </>
              )}
            </span>
          </div>

          <div className="border-b border-slate-200 pb-3">
            <span className="font-bold text-slate-700 block mb-1">Purchased Items:</span>
            <div className="space-y-1.5 pl-2">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex justify-between font-medium">
                  <span className="text-slate-800">• {item.title} (x{item.quantity})</span>
                  <span className="font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-sm font-black">
            <span>Total Amount</span>
            <span className="text-emerald-600 text-base">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {/* Next Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Open in WhatsApp</span>
          </a>

          <Link
            href="/birds"
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center space-x-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
