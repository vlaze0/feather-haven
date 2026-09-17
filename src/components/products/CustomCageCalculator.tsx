'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { Calculator, ShoppingBag, MessageSquare, Check, Sparkles } from 'lucide-react';
import { ProductItem } from '@/types';

export default function CustomCageCalculator() {
  const { addToCartProduct } = useCart();

  const [length, setLength] = useState<number>(24);
  const [breadth, setBreadth] = useState<number>(18);
  const [height, setHeight] = useState<number>(24);
  const [unit, setUnit] = useState<'in' | 'ft' | 'cm'>('in');
  const [material, setMaterial] = useState<'powder_coated' | 'stainless_steel'>('powder_coated');
  const [added, setAdded] = useState(false);

  // Convert inputs to inches for uniform area calculation
  let lInches = length || 0;
  let bInches = breadth || 0;
  let hInches = height || 0;

  if (unit === 'ft') {
    lInches = (length || 0) * 12;
    bInches = (breadth || 0) * 12;
    hInches = (height || 0) * 12;
  } else if (unit === 'cm') {
    lInches = (length || 0) / 2.54;
    bInches = (breadth || 0) / 2.54;
    hInches = (height || 0) / 2.54;
  }

  // Calculate surface area in sq ft
  // Surface area = 2 * (L*B + B*H + L*H) sq inches -> / 144 sq ft
  const sqInches = 2 * (lInches * bInches + bInches * hInches + lInches * hInches);
  const sqFeet = sqInches / 144;

  // Base pricing rate per sq ft
  const ratePerSqFt = material === 'stainless_steel' ? 180 : 110;
  const baseFrameCost = 350; // Tray, latch, labor base

  const calculatedPrice = Math.max(499, Math.round(sqFeet * ratePerSqFt + baseFrameCost));

  // Display dimensions text
  const dimensionString = `${length} × ${breadth} × ${height} ${unit}`;

  const handleAddToCart = () => {
    const customCageProduct: ProductItem = {
      id: `custom-cage-${Date.now()}`,
      name: `Customised Bird Cage (${dimensionString})`,
      slug: `customised-bird-cage-${Date.now()}`,
      price: calculatedPrice,
      discountPrice: calculatedPrice,
      isFeatured: true,
      images: [{ id: '1', url: '/images/products/cage_customised_aviary.jpg', isPrimary: true }],
      brand: 'Pet Bar Barky Custom',
      suitableFor: `Custom Built (${material === 'stainless_steel' ? 'Stainless Steel' : 'Powder Coated'})`,
      dimensions: dimensionString,
      material: material === 'stainless_steel' ? '100% Medical-Grade Stainless Steel' : 'Heavy-Duty Powder-Coated Wire',
      stock: 99,
      categoryId: 'cages',
      description: `Bespoke custom-built cage. Dimensions: ${dimensionString}. Material: ${
        material === 'stainless_steel' ? 'Stainless Steel' : 'Powder Coated Metal'
      }.`,
    };

    addToCartProduct(customCageProduct, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const whatsappMessage = `Hi Feather Haven! I calculated a price estimation for a Customised Bird Cage:
- Length: ${length} ${unit}
- Breadth: ${breadth} ${unit}
- Height: ${height} ${unit}
- Material: ${material === 'stainless_steel' ? 'Stainless Steel' : 'Powder Coated Metal Wire'}
- Estimated Price: ₹${calculatedPrice.toLocaleString('en-IN')}

I would like to place this custom order!`;

  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-white to-emerald-500/10 p-6 sm:p-8 rounded-3xl border border-amber-300/60 shadow-lg space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/60 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black mb-2">
            <Calculator className="w-3.5 h-3.5 text-amber-600" />
            <span>Instant Custom Cage Price Calculator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            🛠️ Customised Cage Price Estimator
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Enter your required Length, Breadth, and Height dimensions below to generate an instant live price estimate.
          </p>
          <div className="mt-3">
            <a
              href="/customizer"
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Launch Full Interactive Customizer App Studio →</span>
            </a>
          </div>
        </div>

        {/* Unit Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <span className="text-[11px] font-bold text-slate-500 px-2">Unit:</span>
          {(['in', 'ft', 'cm'] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              className={`px-3 py-1 rounded-xl text-xs font-black uppercase transition-all ${
                unit === u
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {u === 'in' ? 'Inches' : u === 'ft' ? 'Feet' : 'CM'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* LEFT COLUMN: DIMENSION INPUTS (Length, Breadth, Height) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Length Input */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
              Length ({unit === 'in' ? 'Inches' : unit === 'ft' ? 'Feet' : 'Centimeters'})
            </label>
            <input
              type="number"
              min={6}
              max={120}
              value={length || ''}
              onChange={(e) => setLength(Math.max(1, parseFloat(e.target.value) || 0))}
              placeholder="e.g. 24"
              className="w-full bg-white border-2 border-slate-200 focus:border-amber-500 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 shadow-sm outline-none transition-colors"
            />
          </div>

          {/* Breadth Input */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
              Breadth ({unit === 'in' ? 'Inches' : unit === 'ft' ? 'Feet' : 'Centimeters'})
            </label>
            <input
              type="number"
              min={6}
              max={120}
              value={breadth || ''}
              onChange={(e) => setBreadth(Math.max(1, parseFloat(e.target.value) || 0))}
              placeholder="e.g. 18"
              className="w-full bg-white border-2 border-slate-200 focus:border-amber-500 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 shadow-sm outline-none transition-colors"
            />
          </div>

          {/* Height Input */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
              Height ({unit === 'in' ? 'Inches' : unit === 'ft' ? 'Feet' : 'Centimeters'})
            </label>
            <input
              type="number"
              min={6}
              max={120}
              value={height || ''}
              onChange={(e) => setHeight(Math.max(1, parseFloat(e.target.value) || 0))}
              placeholder="e.g. 24"
              className="w-full bg-white border-2 border-slate-200 focus:border-amber-500 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 shadow-sm outline-none transition-colors"
            />
          </div>

          {/* Material Coating Preference */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
              Material & Finish
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMaterial('powder_coated')}
                className={`p-3 rounded-2xl border-2 text-left transition-all ${
                  material === 'powder_coated'
                    ? 'border-emerald-600 bg-emerald-50 text-slate-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-black">Powder Coated Wire</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">Heavy Duty Non-Toxic</div>
              </button>
              <button
                type="button"
                onClick={() => setMaterial('stainless_steel')}
                className={`p-3 rounded-2xl border-2 text-left transition-all ${
                  material === 'stainless_steel'
                    ? 'border-emerald-600 bg-emerald-50 text-slate-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-black">Stainless Steel</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">100% Medical Grade</div>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PRICE ESTIMATION BOX & ORDER BUTTONS */}
        <div className="lg:col-span-6 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Live Price Estimation</span>
            </span>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-semibold">
              {sqFeet.toFixed(1)} sq ft surface
            </span>
          </div>

          <div className="text-center py-2">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Estimated Custom Price</span>
            <div className="text-4xl sm:text-5xl font-black text-amber-400 mt-1 tracking-tight">
              ₹{calculatedPrice.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              Includes Waste Drawer Tray, Perches & Mounting Latches
            </span>
          </div>

          <div className="space-y-2 bg-slate-800/80 p-4 rounded-2xl text-xs text-slate-300 border border-slate-700/60">
            <div className="flex justify-between">
              <span>Selected Dimensions:</span>
              <strong className="text-white font-mono">{dimensionString}</strong>
            </div>
            <div className="flex justify-between">
              <span>Material Choice:</span>
              <strong className="text-emerald-400 font-medium">
                {material === 'stainless_steel' ? 'Stainless Steel' : 'Powder Coated Wire'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Manufacturing Time:</span>
              <strong className="text-amber-300 font-medium">2 - 3 Business Days</strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-3.5 px-6 rounded-2xl text-xs font-black shadow-lg flex items-center justify-center space-x-2 transition-all ${
                added
                  ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added Custom Cage to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Custom Cage to Cart (₹{calculatedPrice.toLocaleString('en-IN')})</span>
                </>
              )}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl text-xs font-black bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center space-x-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Order Custom Cage on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
