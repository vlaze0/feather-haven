'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MessageCircle, CheckCircle2, Award, ShoppingBag, Sparkles } from 'lucide-react';
import { BirdItem } from '@/types';
import { formatCurrency, generateWhatsAppLink, generateBirdEnquiryMessage } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import GenderSelectionModal from './GenderSelectionModal';

export default function BirdCard({ bird }: { bird: BirdItem }) {
  const { addToCartBird, toggleWishlist, isInWishlist } = useCart();
  const [isGenderModalOpen, setIsGenderModalOpen] = useState(false);

  let firstImage = '/images/birds/normal_green_budgie.jpg';
  const rawImages = bird.images as any;
  if (Array.isArray(rawImages)) {
    if (rawImages.length > 0) firstImage = rawImages[0];
  } else if (typeof rawImages === 'string') {
    try {
      const parsed = JSON.parse(rawImages);
      if (Array.isArray(parsed) && parsed.length > 0) firstImage = parsed[0];
      else if (rawImages.startsWith('http') || rawImages.startsWith('/')) firstImage = rawImages;
    } catch (e) {
      if (rawImages.startsWith('http') || rawImages.startsWith('/')) firstImage = rawImages;
    }
  }

  const inWishlist = isInWishlist(bird.id);
  const enquiryMessage = generateBirdEnquiryMessage(bird.name, bird.birdCode, bird.price);
  const whatsappLink = generateWhatsAppLink('919876543210', enquiryMessage);

  const handleGenderConfirm = (selectedBird: BirdItem, gender: 'Male' | 'Female' | 'Pair') => {
    addToCartBird(selectedBird, gender);
  };

  const getStatusBadge = () => {
    switch (bird.status) {
      case 'AVAILABLE':
        return (
          <span className="bg-emerald-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Available</span>
          </span>
        );
      case 'RESERVED':
        return (
          <span className="bg-amber-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm">
            Reserved
          </span>
        );
      case 'SOLD':
        return (
          <span className="bg-rose-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm">
            Sold
          </span>
        );
      case 'COMING_SOON':
        return (
          <span className="bg-sky-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm">
            Coming Soon
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative">
        {/* Top Image Container with object-cover object-[center_15%] so bird faces are centered */}
        <div className="relative aspect-[4/3] bg-slate-950/5 overflow-hidden">
          <Image
            src={firstImage}
            alt={bird.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-[center_15%] group-hover:scale-105 transition-transform duration-500"
          />

          {/* Overlay Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            {getStatusBadge()}
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-lg">
              {bird.birdCode}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(bird)}
            className={`absolute top-3 right-3 p-2.5 rounded-2xl backdrop-blur-md transition-all ${
              inWishlist
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
            }`}
            title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
          </button>

          {/* Variety Badge */}
          {bird.variety && (
            <div className="absolute bottom-3 right-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold text-[10px] px-2.5 py-1 rounded-xl shadow-md flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>{bird.variety}</span>
            </div>
          )}

          {/* Health Tag */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center space-x-1 shadow-sm">
            <Award className="w-3 h-3 text-emerald-600" />
            <span>{bird.healthStatus}</span>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>{bird.species}</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                {bird.gender}
              </span>
            </div>

            <Link href={`/birds/${bird.slug}`} className="group-hover:text-emerald-600 transition-colors">
              <h3 className="font-bold text-slate-900 text-base line-clamp-1">{bird.name}</h3>
            </Link>

            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{bird.description}</p>

            <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-600 font-medium">
              <span className="bg-slate-100 px-2 py-1 rounded-lg">Color: {bird.color}</span>
              <span className="bg-slate-100 px-2 py-1 rounded-lg">Age: {bird.age}</span>
            </div>
          </div>

          {/* Price & Action Row */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div>
              <span className="text-xs text-slate-400 font-semibold block uppercase">Price</span>
              <span className="text-lg font-extrabold text-slate-900">{formatCurrency(bird.price)}</span>
            </div>

            <div className="flex items-center space-x-1.5">
              {/* WhatsApp Enquiry Button */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl transition-colors"
                title="Enquire on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              {/* Buy / Add to Cart triggers Gender Modal */}
              {bird.status === 'AVAILABLE' ? (
                <button
                  onClick={() => setIsGenderModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center space-x-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              ) : (
                <button
                  disabled
                  className="bg-slate-100 text-slate-400 px-3 py-2 rounded-xl text-xs font-bold cursor-not-allowed"
                >
                  {bird.status}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gender Selection Modal Popup */}
      <GenderSelectionModal
        bird={bird}
        isOpen={isGenderModalOpen}
        onClose={() => setIsGenderModalOpen(false)}
        onConfirm={handleGenderConfirm}
      />
    </>
  );
}
