'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingBag, Heart, AlertTriangle } from 'lucide-react';
import { ProductItem } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';

export default function ProductCard({ product }: { product: ProductItem }) {
  const { addToCartProduct, toggleWishlist, isInWishlist } = useCart();

  let firstImage = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80';
  if (product.images && product.images.length > 0) {
    firstImage = product.images.find((i) => i.isPrimary)?.url || product.images[0].url;
  }

  const inWishlist = isInWishlist(product.id);
  const discountPercent =
    product.discountPrice && product.price > product.discountPrice
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  const currentPrice = product.discountPrice ?? product.price;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative">
      {/* Top Image Container */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden p-4">
        <Image
          src={firstImage}
          alt={product.name}
          fill
          unoptimized
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[11px] font-extrabold px-2.5 py-1 rounded-xl shadow-sm">
            {discountPercent}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 p-2.5 rounded-2xl backdrop-blur-md transition-all ${
            inWishlist
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
        </button>

        {/* Stock Warning */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-3 left-3 bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Only {product.stock} left</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
            <span>{product.brand || product.category?.name || 'Aviary Supply'}</span>
            <div className="flex items-center text-amber-400 text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="ml-1 text-slate-600 font-bold">4.8</span>
            </div>
          </div>

          <Link href={`/products/${product.slug}`} className="group-hover:text-emerald-600 transition-colors">
            <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">{product.name}</h3>
          </Link>

          {product.suitableFor && (
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
              Suitable for: <strong className="text-slate-700">{product.suitableFor}</strong>
            </p>
          )}
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-extrabold text-slate-900">{formatCurrency(currentPrice)}</span>
              {product.discountPrice && (
                <span className="text-xs text-slate-400 line-through">{formatCurrency(product.price)}</span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCartProduct(product)}
            disabled={product.stock <= 0}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              product.stock > 0
                ? 'bg-slate-900 hover:bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
