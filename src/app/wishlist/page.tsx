'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatCurrency } from '@/lib/utils';
import BirdCard from '@/components/birds/BirdCard';
import ProductCard from '@/components/products/ProductCard';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCartBird, addToCartProduct } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
        <div className="bg-white max-w-md w-full p-10 rounded-3xl border border-slate-200 text-center shadow-lg">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Your Wishlist is Empty</h2>
          <p className="text-xs text-slate-500 mt-2">
            Click the heart icon on any bird or cage to save it here for later.
          </p>
          <Link
            href="/birds"
            className="mt-6 inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl shadow-md transition-all"
          >
            Explore Available Birds
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Saved Wishlist ({wishlist.length})</h1>
          <p className="text-xs text-slate-500 mt-1">Items and birds saved to your personal collection.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => {
            const isBird = 'birdCode' in item;
            if (isBird) {
              return <BirdCard key={item.id} bird={item as any} />;
            } else {
              return <ProductCard key={item.id} product={item as any} />;
            }
          })}
        </div>
      </div>
    </div>
  );
}
