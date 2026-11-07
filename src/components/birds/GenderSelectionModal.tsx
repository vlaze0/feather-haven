'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, CheckCircle2, ShoppingBag, Heart } from 'lucide-react';
import { BirdItem } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function GenderSelectionModal({
  bird,
  isOpen,
  onClose,
  onConfirm,
}: {
  bird: BirdItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bird: BirdItem, gender: 'Male' | 'Female' | 'Pair') => void;
}) {
  const [selectedGender, setSelectedGender] = useState<'Male' | 'Female' | 'Pair'>('Male');

  if (!isOpen || !bird) return null;

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

  const handleConfirm = () => {
    onConfirm(bird, selectedGender);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 relative space-y-5 p-6 animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Bird Brief */}
        <div className="flex items-center space-x-4 pt-1">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            <Image
              src={firstImage}
              alt={bird.name}
              fill
              unoptimized
              className="object-cover object-[center_15%]"
            />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
              {bird.species}
            </span>
            <h3 className="font-extrabold text-slate-900 text-base line-clamp-1">{bird.name}</h3>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-lg font-black text-slate-900">
                {formatCurrency(selectedGender === 'Pair' ? bird.price * 2 : bird.price)}
              </span>
              {selectedGender === 'Pair' && (
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  Pair (2 Birds)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Gender Selection Title */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase text-slate-700 tracking-wider block">
              Select Bird Gender / Pair Option:
            </label>
            <span className="text-[11px] font-medium text-slate-500">
              {selectedGender === 'Pair' ? 'Price is 2x for Pair' : 'Single Bird Price'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* Option 1: Male */}
            <button
              type="button"
              onClick={() => setSelectedGender('Male')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                selectedGender === 'Male'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.03]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-emerald-300'
              }`}
            >
              <span className="text-xl">♂️</span>
              <span className="font-extrabold text-xs">Male</span>
              <span className={`text-[10px] font-bold ${selectedGender === 'Male' ? 'text-emerald-100' : 'text-slate-900'}`}>
                {formatCurrency(bird.price)}
              </span>
              <span className="text-[9px] opacity-80">Single Bird</span>
            </button>

            {/* Option 2: Female */}
            <button
              type="button"
              onClick={() => setSelectedGender('Female')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                selectedGender === 'Female'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.03]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-emerald-300'
              }`}
            >
              <span className="text-xl">♀️</span>
              <span className="font-extrabold text-xs">Female</span>
              <span className={`text-[10px] font-bold ${selectedGender === 'Female' ? 'text-emerald-100' : 'text-slate-900'}`}>
                {formatCurrency(bird.price)}
              </span>
              <span className="text-[9px] opacity-80">Single Bird</span>
            </button>

            {/* Option 3: Bonded Pair */}
            <button
              type="button"
              onClick={() => setSelectedGender('Pair')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                selectedGender === 'Pair'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.03]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-emerald-300'
              }`}
            >
              <span className="text-xl">👩‍❤️‍👨</span>
              <span className="font-extrabold text-xs">Breeding Pair</span>
              <span className={`text-[10px] font-bold ${selectedGender === 'Pair' ? 'text-emerald-100' : 'text-emerald-700'}`}>
                {formatCurrency(bird.price * 2)}
              </span>
              <span className="text-[9px] opacity-80">Male + Female</span>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleConfirm}
            className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-extrabold text-xs py-4 px-6 rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              Confirm ({selectedGender === 'Pair' ? 'Breeding Pair' : selectedGender}) & Add to Cart • {formatCurrency(selectedGender === 'Pair' ? bird.price * 2 : bird.price)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
