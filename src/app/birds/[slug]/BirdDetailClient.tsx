'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Award,
  Heart,
  MessageCircle,
  ShoppingBag,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { BirdItem, ProductItem } from '@/types';
import { formatCurrency, generateWhatsAppLink, generateBirdEnquiryMessage } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import SmartRecommendations from '@/components/products/SmartRecommendations';
import GenderSelectionModal from '@/components/birds/GenderSelectionModal';

export default function BirdDetailClient({
  bird,
  recommendedProducts,
}: {
  bird: BirdItem;
  recommendedProducts: ProductItem[];
}) {
  const router = useRouter();
  const { addToCartBird, toggleWishlist, isInWishlist } = useCart();
  const [isGenderModalOpen, setIsGenderModalOpen] = useState(false);

  let imagesList: string[] = ['/images/birds/normal_green_budgie.jpg'];
  if (Array.isArray(bird.images) && bird.images.length > 0) {
    imagesList = bird.images;
  } else if (typeof bird.images === 'string') {
    try {
      const parsed = JSON.parse(bird.images);
      if (Array.isArray(parsed) && parsed.length > 0) imagesList = parsed;
    } catch (e) {}
  }

  const [activeImage, setActiveImage] = useState(imagesList[0]);
  const inWishlist = isInWishlist(bird.id);

  const enquiryMessage = generateBirdEnquiryMessage(bird.name, bird.birdCode, bird.price);
  const whatsappLink = generateWhatsAppLink('919876543210', enquiryMessage);

  const handleGenderConfirm = (selectedBird: BirdItem, gender: 'Male' | 'Female' | 'Pair') => {
    addToCartBird(selectedBird, gender);
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
          <Link href="/birds" className="hover:text-emerald-600">
            Birds Marketplace
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate max-w-xs">{bird.name}</span>
        </nav>

        {/* Top Product Showcase Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Image Gallery with top alignment so bird faces are centered */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] bg-slate-950/5 rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
              <Image
                src={activeImage}
                alt={bird.name}
                fill
                unoptimized
                className="object-cover object-[center_15%]"
                priority
              />
              <div className="absolute top-4 left-4">
                {bird.status === 'AVAILABLE' ? (
                  <span className="bg-emerald-500 text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Available for Purchase</span>
                  </span>
                ) : (
                  <span className="bg-rose-600 text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                    {bird.status}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Selectors (Showing BOTH images for Hagoromo Helicopter and multi-image birds) */}
            {imagesList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {imagesList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === imgUrl ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-slate-200'
                    }`}
                  >
                    <Image src={imgUrl} alt="bird thumbnail" fill unoptimized className="object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Bird Details & Action */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                  Ref Code: {bird.birdCode}
                </span>
                <span className="text-xs text-emerald-700 bg-emerald-50 font-bold px-3 py-1 rounded-full">
                  {bird.species}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{bird.name}</h1>

              <div className="mt-4 flex items-baseline space-x-3">
                <span className="text-3xl font-black text-slate-900">{formatCurrency(bird.price)}</span>
                <span className="text-xs text-slate-500 font-medium">Taxes included</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mt-4">{bird.description}</p>

              {/* Key Specs Table */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Color</span>
                  <span className="text-xs font-bold text-slate-900">{bird.color}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Approx. Age</span>
                  <span className="text-xs font-bold text-slate-900">{bird.age}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Default Gender</span>
                  <span className="text-xs font-bold text-slate-900">{bird.gender}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Care Level</span>
                  <span className="text-xs font-bold text-emerald-700">{bird.careLevel}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 col-span-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Temperament</span>
                  <span className="text-xs font-bold text-slate-900">{bird.temperament || 'Friendly'}</span>
                </div>
              </div>
            </div>

            {/* Actions & WhatsApp button */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row gap-3">
                {bird.status === 'AVAILABLE' ? (
                  <>
                    <button
                      onClick={() => setIsGenderModalOpen(true)}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-md transition-all text-center"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() => setIsGenderModalOpen(true)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full bg-slate-100 text-slate-400 font-bold text-xs py-3.5 rounded-2xl cursor-not-allowed text-center"
                  >
                    Bird is {bird.status}
                  </button>
                )}

                <button
                  onClick={() => toggleWishlist(bird)}
                  className={`p-3.5 rounded-2xl border transition-colors shrink-0 flex items-center justify-center ${
                    inWishlist
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* WhatsApp Direct Link */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs py-3.5 rounded-2xl transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Enquire about {bird.name} on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Detailed Health & Diet Tabbed Spec Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2 mb-3">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Vet Check & Health Information</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {bird.healthInfo || 'Fully de-wormed, active feeding habits, and checked by qualified avian vet.'}
            </p>
            <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-900 space-y-1">
              <span className="font-bold block">Health Status: {bird.healthStatus}</span>
              <span>All birds are quarantined for 14 days before dispatch to ensure zero illness.</span>
            </div>
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2 mb-3">
              <Info className="w-5 h-5 text-emerald-600" />
              <span>Recommended Diet & Nutrition</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {bird.dietRecommendation || 'High-protein seed mix, golden millet sprays, calcium block, and fresh greens.'}
            </p>
          </div>
        </div>

        {/* Smart Recommendations Section */}
        <SmartRecommendations bird={bird} recommendedProducts={recommendedProducts} />
      </div>

      {/* Gender Selection Modal Popup */}
      <GenderSelectionModal
        bird={bird}
        isOpen={isGenderModalOpen}
        onClose={() => setIsGenderModalOpen(false)}
        onConfirm={handleGenderConfirm}
      />
    </div>
  );
}
