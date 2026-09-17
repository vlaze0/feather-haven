import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CheckCircle2, MessageCircle, ArrowRight, PackageCheck, Truck, Store } from 'lucide-react';
import { formatCurrency, generateWhatsAppLink } from '@/lib/utils';

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

  const whatsappMsg = `Hello Feather Haven, I placed Order #${order.orderNumber}. I would like to track my delivery status.`;
  const whatsappLink = generateWhatsAppLink('919876543210', whatsappMsg);

  return (
    <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl space-y-8 text-center sm:text-left">
        {/* Success Icon Header */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-emerald-600 font-extrabold">Order Confirmed!</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Thank You for Your Order</h1>
            <p className="text-xs text-slate-500 mt-1">
              Order Number: <strong className="text-slate-900 font-mono">{order.orderNumber}</strong>
            </p>
          </div>
        </div>

        {/* Order Details Receipt Box */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="font-bold text-slate-700">Customer Name</span>
            <span className="font-extrabold text-slate-900">{order.customerName}</span>
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
                  <span>Home Delivery</span>
                </>
              )}
            </span>
          </div>

          <div className="border-b border-slate-200 pb-3">
            <span className="font-bold text-slate-700 block mb-1">Purchased Items:</span>
            <div className="space-y-1 pl-2">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex justify-between font-medium">
                  <span className="text-slate-800">• {item.title} (x{item.quantity})</span>
                  <span className="font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-sm font-black">
            <span>Total Paid</span>
            <span className="text-emerald-600 text-base">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {/* Next Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Track Order on WhatsApp</span>
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
