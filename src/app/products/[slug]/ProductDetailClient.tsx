'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  ShoppingBag,
  Heart,
  MessageCircle,
  Truck,
  ShieldCheck,
  Plus,
  Minus,
  Check,
  Package,
} from 'lucide-react';
import { ProductItem } from '@/types';
import { formatCurrency, generateWhatsAppLink, generateProductEnquiryMessage } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import ProductCard from '@/components/products/ProductCard';
import CustomCageCalculator from '@/components/products/CustomCageCalculator';

export default function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: ProductItem;
  relatedProducts: ProductItem[];
}) {
  const router = useRouter();
  const { addToCartProduct, toggleWishlist, isInWishlist } = useCart();

  let imagesList = ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1000&q=80'];
  if (product.images && product.images.length > 0) {
    imagesList = product.images.map((i) => i.url);
  }

  const [activeImage, setActiveImage] = useState(imagesList[0]);
  const [quantity, setQuantity] = useState(1);
  const inWishlist = isInWishlist(product.id);

  const currentPrice = product.discountPrice ?? product.price;

  const enquiryMsg = generateProductEnquiryMessage(product.name, currentPrice);
  const whatsappLink = generateWhatsAppLink('919876543210', enquiryMsg);

  const handleBuyNow = () => {
    addToCartProduct(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 font-medium flex items-center space-x-2">
          <Link href="/" className="hover:text-emerald-600">
            Home
          </Link>
          <span>/</span>
          <Link href={`/${product.category?.slug || 'cages'}`} className="hover:text-emerald-600">
            {product.category?.name || 'Category'}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Showcase */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 p-6">
              <Image src={activeImage} alt={product.name} fill className="object-contain p-4" priority />
            </div>

            {imagesList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {imagesList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-slate-50 ${
                      activeImage === imgUrl ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-slate-200'
                    }`}
                  >
                    <Image src={imgUrl} alt="product thumbnail" fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Order controls */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                {product.brand || product.category?.name || 'Aviary Product'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{product.name}</h1>

              <div className="mt-3 flex items-center space-x-3">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-bold">4.9 (28 Customer Reviews)</span>
              </div>

              <div className="mt-4 flex items-baseline space-x-3">
                <span className="text-3xl font-black text-slate-900">{formatCurrency(currentPrice)}</span>
                {product.discountPrice && (
                  <span className="text-sm text-slate-400 line-through">{formatCurrency(product.price)}</span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mt-4">{product.description}</p>

              {/* Product Specifications */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {product.suitableFor && (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Suitable For</span>
                    <span className="text-xs font-bold text-slate-900">{product.suitableFor}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Dimensions</span>
                    <span className="text-xs font-bold text-slate-900">{product.dimensions}</span>
                  </div>
                )}
                {product.material && (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Material</span>
                    <span className="text-xs font-bold text-slate-900">{product.material}</span>
                  </div>
                )}
                {product.packageWeight && (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Package Weight</span>
                    <span className="text-xs font-bold text-slate-900">{product.packageWeight}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Selector & Buy CTAs */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center space-x-3 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-slate-600 hover:text-slate-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-extrabold text-slate-900 w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-1 text-slate-600 hover:text-slate-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-slate-400">
                  ({product.stock > 0 ? `${product.stock} available` : 'Out of stock'})
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-md transition-all text-center disabled:bg-slate-200"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => addToCartProduct(product, quantity)}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 disabled:bg-slate-200"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-2xl border transition-colors shrink-0 flex items-center justify-center ${
                    inWishlist
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-white' : ''}`} />
                </button>
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs py-3 rounded-2xl transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Enquire about stock on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Custom Cage Estimator for Custom Products */}
        {product.name.toLowerCase().includes('custom') && (
          <div>
            <CustomCageCalculator />
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-6">Related Products You Might Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel: any) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
