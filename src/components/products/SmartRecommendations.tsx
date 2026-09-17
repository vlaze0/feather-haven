'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Plus, Check, ShoppingBag } from 'lucide-react';
import { BirdItem, ProductItem } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';

export default function SmartRecommendations({
  bird,
  recommendedProducts,
}: {
  bird?: BirdItem;
  recommendedProducts: ProductItem[];
}) {
  const { addToCartProduct, addToCartBird, showToast } = useCart();

  if (!recommendedProducts || recommendedProducts.length === 0) return null;

  // Select 3 items for the "Frequently Bought Together" starter pack
  const bundleItems = recommendedProducts.slice(0, 3);
  const bundleTotal = (bird ? bird.price : 0) + bundleItems.reduce((sum, p) => sum + (p.discountPrice ?? p.price), 0);

  const handleAddBundleToCart = () => {
    if (bird && bird.status === 'AVAILABLE') {
      addToCartBird(bird);
    }
    bundleItems.forEach((item) => {
      addToCartProduct(item, 1);
    });
    showToast('Added complete starter bundle to your cart! 🛍️');
  };

  return (
    <div className="space-y-12 my-12">
      {/* 1. Frequently Bought Together Bundle */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-64 h-64 text-emerald-400" />
        </div>

        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Smart Starter Pack Bundle</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-white">Frequently Bought Together</h3>
        <p className="text-xs text-slate-300 mt-1 max-w-xl">
          Everything you need to give your bird a healthy, happy home on day one.
        </p>

        <div className="mt-6 flex flex-col lg:flex-row items-center justify-between gap-6 bg-white/5 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/10">
          {/* Bundle Items Flow */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            {/* Bird item if present */}
            {bird && (
              <>
                <div className="text-center group">
                  <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden relative border-2 border-emerald-500 shadow-md">
                    <Image
                      src={
                        typeof bird.images === 'string'
                          ? JSON.parse(bird.images)[0]
                          : bird.images[0]
                      }
                      alt={bird.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-[11px] font-bold text-slate-200 mt-2 max-w-[100px] truncate">{bird.name}</p>
                  <p className="text-xs font-extrabold text-emerald-400">{formatCurrency(bird.price)}</p>
                </div>
                <Plus className="w-5 h-5 text-slate-400 shrink-0" />
              </>
            )}

            {/* Recommended product items */}
            {bundleItems.map((item, idx) => (
              <React.Fragment key={item.id}>
                <div className="text-center group">
                  <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden relative border border-slate-700 shadow-md">
                    <Image
                      src={item.images[0]?.url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80'}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <p className="text-[11px] font-bold text-slate-200 mt-2 max-w-[100px] truncate">{item.name}</p>
                  <p className="text-xs font-extrabold text-amber-400">
                    {formatCurrency(item.discountPrice ?? item.price)}
                  </p>
                </div>
                {idx < bundleItems.length - 1 && <Plus className="w-5 h-5 text-slate-400 shrink-0" />}
              </React.Fragment>
            ))}
          </div>

          {/* Bundle Summary & CTA */}
          <div className="text-center lg:text-right border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6 shrink-0 w-full lg:w-auto">
            <span className="text-xs text-slate-400 font-semibold block uppercase">Bundle Total</span>
            <span className="text-2xl font-extrabold text-white">{formatCurrency(bundleTotal)}</span>
            <button
              onClick={handleAddBundleToCart}
              className="mt-3 w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Bundle to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Recommended Care Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Recommended for {bird ? bird.name : 'Your Bird'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hand-picked cages, seed mixes, calcium blocks, and toys suitable for this species.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-slate-50 rounded-xl relative overflow-hidden shrink-0 border border-slate-100">
                  <Image
                    src={product.images[0]?.url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80'}
                    alt={product.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    {product.category?.name || 'Supply'}
                  </span>
                  <Link href={`/products/${product.slug}`}>
                    <h4 className="font-bold text-slate-900 text-xs line-clamp-1 hover:text-emerald-600 transition-colors">
                      {product.name}
                    </h4>
                  </Link>
                  <span className="text-xs font-extrabold text-slate-900 mt-1 block">
                    {formatCurrency(product.discountPrice ?? product.price)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => addToCartProduct(product)}
                className="mt-3 w-full bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 text-xs font-bold py-2 rounded-xl transition-colors"
              >
                + Add Item
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
