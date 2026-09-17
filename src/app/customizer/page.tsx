'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Check,
  ShoppingBag,
  MessageCircle,
  Bird,
  Layers,
  Ruler,
  Palette,
  PackagePlus,
  ShieldCheck,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { ProductItem } from '@/types';
import { formatCurrency, generateWhatsAppLink } from '@/lib/utils';

// Predefined bird companions for customizer
const BIRD_OPTIONS = [
  {
    id: 'budgie_single',
    name: 'Single Hand-Tamed Budgie',
    species: 'Budgerigar (Sky Blue / Yellow)',
    price: 1400,
    icon: '🦜',
    img: '/images/birds/normal_green_budgie.jpg',
    minDimensions: { l: 18, b: 14, h: 18 },
  },
  {
    id: 'budgie_pair',
    name: 'Breeding Pair of Budgies',
    species: 'Budgerigar Pair (Bonded)',
    price: 2600,
    icon: '🦜🦜',
    img: '/images/birds/sky_blue_budgie.jpg',
    minDimensions: { l: 24, b: 18, h: 20 },
  },
  {
    id: 'cockatiel',
    name: 'Hand-Reared Cockatiel',
    species: 'Cockatiel (Grey / Lutino / Pearl)',
    price: 4800,
    icon: '🐤',
    img: '/images/birds/ckt_grey_cockatiel.png',
    minDimensions: { l: 24, b: 20, h: 30 },
  },
  {
    id: 'lovebird',
    name: 'Peach-Faced Lovebird',
    species: 'Lovebird (Vibrant Green & Peach)',
    price: 2800,
    icon: '🐦',
    img: '/images/birds/lb_normal_green_peach.png',
    minDimensions: { l: 22, b: 16, h: 22 },
  },
  {
    id: 'conure',
    name: 'Sun Conure (Rio Hand-Fed)',
    species: 'Sun Conure (Fiery Orange & Gold)',
    price: 18500,
    icon: '🦜',
    img: '/images/birds/snc_normal.png',
    minDimensions: { l: 30, b: 24, h: 36 },
  },
  {
    id: 'finch_pair',
    name: 'Java Sparrow Finch Pair',
    species: 'Finch (Peaceful Gentle Songbirds)',
    price: 2400,
    icon: '🕊️',
    img: '/images/birds/fnc_java_sparrow.png',
    minDimensions: { l: 20, b: 14, h: 18 },
  },
  {
    id: 'none',
    name: 'No Bird (Habitat & Cage Only)',
    species: 'I already have my pet birds',
    price: 0,
    icon: '🏡',
    img: '/images/products/cage_customised_aviary.jpg',
    minDimensions: { l: 16, b: 12, h: 16 },
  },
];

// Color finishes
const COLOR_OPTIONS = [
  { id: 'silver', name: 'Classic Silver Stainless', hex: '#94a3b8', border: 'border-slate-400' },
  { id: 'pink', name: 'Pet Bar Pink Mild Steel', hex: '#f472b6', border: 'border-pink-400' },
  { id: 'black', name: 'Matte Jet Black', hex: '#334155', border: 'border-slate-700' },
  { id: 'white', name: 'Gloss Snow White', hex: '#f8fafc', border: 'border-slate-300' },
  { id: 'emerald', name: 'Forest Emerald Green', hex: '#059669', border: 'border-emerald-600' },
];

// Authentic Accessories & Enrichment
const ACCESSORY_OPTIONS = [
  {
    id: 'chewing_swing',
    name: 'Natural Wooden Chewing Activity Swing & Shredding Toy',
    price: 399,
    img: '/images/products/toy_chewing_swing.jpg',
    type: 'swing',
  },
  {
    id: 'dswing',
    name: 'Arch Wooden Bead Bell Swing with Perch (D-Swing)',
    price: 149,
    img: '/images/products/toy_dswing.png',
    type: 'swing',
  },
  {
    id: 'two_tier_swing',
    name: '2-Tier Natural Wood Branch Hanging Rope Perch Swing',
    price: 299,
    img: '/images/products/toy_two_tier_rope_swing.jpg',
    type: 'swing',
  },
  {
    id: 'wide_swing',
    name: 'Wide Budgie & Parakeet Wooden Perch Swing',
    price: 189,
    img: '/images/products/toy_budgie_wooden_swing.jpg',
    type: 'swing',
  },
  {
    id: 'ladder_bridge',
    name: 'Suspended Wooden Ladder Platform Swing with Metal Chains',
    price: 219,
    img: '/images/products/toy_wooden_ladder_bridge.jpg',
    type: 'ladder',
  },
  {
    id: 'cuttlefish_bone',
    name: 'Pure Natural Cuttlefish Bone for Birds (Pack of 4)',
    price: 149,
    img: '/images/products/cuttlefish_bone_natural.webp',
    type: 'calcium',
  },
  {
    id: 'calcium_block',
    name: 'Hanging Mineral Calcium Block with Cage Clip',
    price: 99,
    img: '/images/products/hanging_calcium_mineral_block.jpg',
    type: 'calcium',
  },
  {
    id: 'jute_nest',
    name: 'Handcrafted Jute Bird Nest for Cages & Breeding',
    price: 179,
    img: '/images/products/nest_handcrafted_jute.jpg',
    type: 'nest',
  },
  {
    id: 'clay_pot',
    name: 'Earthen Clay Nesting Pots for Breeding',
    price: 149,
    img: '/images/products/nest_clay_pots.jpg',
    type: 'nest',
  },
];

// Authentic Nutrition Options
const NUTRITION_OPTIONS = [
  {
    id: 'seed_diet',
    name: 'Avigrain Budgie Grain & Seed Diet (1kg)',
    price: 249,
    img: '/images/products/seed_avigrain_budgie_mix.jpg',
    desc: 'Cleaned French White Millet, Panorama Millet, Panicum, Plain Canary Seed & Red Millet',
  },
  {
    id: 'seed_mix_11',
    name: '11-in-1 Fortified Multi-Seed Mix for Budgies & Cockatiels (1kg)',
    price: 329,
    img: '/images/products/seed_mix_11_15_grains.webp',
    desc: '11-15 grains with sunflower seeds, groats, flaxseeds, millets, buckwheat & canary seeds',
  },
  {
    id: 'none',
    name: 'No Food (I already have seed supply)',
    price: 0,
    img: '',
    desc: 'Skip nutrition bundle',
  },
];

export default function CustomizerPage() {
  const { addToCartProduct, showToast } = useCart();

  // Active step
  const [activeTab, setActiveTab] = useState<'bird' | 'cage' | 'accessories' | 'food'>('bird');

  // Customizer selections
  const [selectedBird, setSelectedBird] = useState(BIRD_OPTIONS[0]);
  const [length, setLength] = useState(28);
  const [breadth, setBreadth] = useState(18);
  const [height, setHeight] = useState(24);
  const [unit, setUnit] = useState<'in' | 'ft' | 'cm'>('in');
  const [material, setMaterial] = useState<'powder_coated' | 'stainless_steel'>('powder_coated');
  const [wireSpacing, setWireSpacing] = useState<'0.5' | '0.75' | '1.0'>('0.5');
  const [colorFinish, setColorFinish] = useState(COLOR_OPTIONS[0]);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([
    'chewing_swing',
    'cuttlefish_bone',
  ]);
  const [selectedFood, setSelectedFood] = useState(NUTRITION_OPTIONS[0]);
  const [added, setAdded] = useState(false);

  // Conversion to inches for uniform calculations
  const lInches = unit === 'ft' ? length * 12 : unit === 'cm' ? length / 2.54 : length;
  const bInches = unit === 'ft' ? breadth * 12 : unit === 'cm' ? breadth / 2.54 : breadth;
  const hInches = unit === 'ft' ? height * 12 : unit === 'cm' ? height / 2.54 : height;

  // Surface area in sq ft
  const sqFeet = (2 * (lInches * bInches + bInches * hInches + lInches * hInches)) / 144;

  // Pricing calculation
  const ratePerSqFt = material === 'stainless_steel' ? 180 : 110;
  const baseFrameCost = 350;
  const cagePrice = Math.max(499, Math.round(sqFeet * ratePerSqFt + baseFrameCost));

  const accessoriesTotal = selectedAccessories.reduce((sum, accId) => {
    const item = ACCESSORY_OPTIONS.find((a) => a.id === accId);
    return sum + (item ? item.price : 0);
  }, 0);

  const birdPrice = selectedBird.price;
  const foodPrice = selectedFood.price;

  // Bundle discount if customer orders Cage + 2+ Accessories + Food
  const isBundle = selectedAccessories.length >= 2 && selectedFood.id !== 'none';
  const bundleDiscount = isBundle ? 200 : 0;

  const grandTotal = Math.max(
    499,
    cagePrice + birdPrice + accessoriesTotal + foodPrice - bundleDiscount
  );

  const dimensionsLabel = `${length} × ${breadth} × ${height} ${unit}`;

  // Toggle accessories
  const toggleAccessory = (id: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add custom build to cart
  const handleAddToCart = () => {
    const customBundleProduct: ProductItem = {
      id: `custom-habitat-${Date.now()}`,
      name: `Customised Bird Habitat Bundle (${dimensionsLabel})`,
      slug: `custom-habitat-${Date.now()}`,
      price: grandTotal + bundleDiscount,
      discountPrice: grandTotal,
      isFeatured: true,
      images: [
        {
          id: '1',
          url: colorFinish.id === 'pink' ? '/images/products/cage_2ft_pink.jpg' : '/images/products/cage_customised_aviary.jpg',
          isPrimary: true,
        },
      ],
      brand: 'Feather Haven Bespoke Studio',
      suitableFor: selectedBird.name,
      dimensions: dimensionsLabel,
      material: material === 'stainless_steel' ? '100% Medical-Grade Stainless Steel' : `Powder-Coated Wire (${colorFinish.name})`,
      stock: 50,
      categoryId: 'cages',
      description: `Bespoke Habitat Setup including: Custom Cage (${dimensionsLabel}, ${colorFinish.name}, ${material === 'stainless_steel' ? 'Stainless Steel' : 'Powder Coated Metal'}), Companion: ${selectedBird.name}, Accessories: ${selectedAccessories.length} items, Nutrition: ${selectedFood.name}.`,
    };

    addToCartProduct(customBundleProduct, 1);
    setAdded(true);
    showToast('Customised Habitat added to your cart! 🛍️');
    setTimeout(() => setAdded(false), 3000);
  };

  // WhatsApp Enquiry Link
  const whatsappDetails = `Hello Feather Haven! I configured a Bespoke Custom Habitat Setup on your Customizer App:
- Dimensions: ${dimensionsLabel}
- Frame Finish: ${colorFinish.name}
- Material: ${material === 'stainless_steel' ? 'Medical Stainless Steel' : 'Powder Coated Wire'}
- Wire Spacing: ${wireSpacing} inch
- Companion Bird: ${selectedBird.name} (₹${birdPrice.toLocaleString('en-IN')})
- Accessories (${selectedAccessories.length}): ${selectedAccessories
    .map((id) => ACCESSORY_OPTIONS.find((a) => a.id === id)?.name)
    .filter(Boolean)
    .join(', ')}
- Nutrition: ${selectedFood.name}
- Calculated Total: ₹${grandTotal.toLocaleString('en-IN')}

Can you confirm build time and delivery details?`;

  const whatsappUrl = generateWhatsAppLink('919876543210', whatsappDetails);

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-amber-900/40">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-mono font-bold mb-3 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Customizer Studio App</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Design Your Bespoke Bird Habitat 🛠️
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Tailor custom cage dimensions, safe wire spacing, non-toxic color coatings, companion birds, authentic enrichment swings, and gourmet nutrition with instant visual preview.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center shrink-0 self-start md:self-auto">
            <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">Live Estimated Cost</span>
            <span className="text-2xl sm:text-3xl font-black text-white">{formatCurrency(grandTotal)}</span>
            {bundleDiscount > 0 && (
              <span className="text-[11px] font-bold text-emerald-400 block mt-0.5">
                🎉 Starter Bundle: ₹200 OFF applied
              </span>
            )}
          </div>
        </div>

        {/* Step Tabs Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'bird', label: '1. Companion Bird', icon: Bird },
            { id: 'cage', label: '2. Cage Sizing & Finish', icon: Ruler },
            { id: 'accessories', label: '3. Swings & Toys', icon: Layers },
            { id: 'food', label: '4. Nutrition Pack', icon: PackagePlus },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all shrink-0 border ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20 scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Customizer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Form Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8">
            {/* TAB 1: BIRD SELECTION */}
            {activeTab === 'bird' && (
              <div className="space-y-6 animate-in fade-in-50">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                    <Bird className="w-5 h-5 text-emerald-600" />
                    <span>Choose Your Feathered Companion</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Select a hand-reared bird or choose &apos;No Bird&apos; if you already have pets.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {BIRD_OPTIONS.map((bird) => {
                    const isSelected = selectedBird.id === bird.id;
                    return (
                      <div
                        key={bird.id}
                        onClick={() => {
                          setSelectedBird(bird);
                          if (length < bird.minDimensions.l) setLength(bird.minDimensions.l);
                          if (breadth < bird.minDimensions.b) setBreadth(bird.minDimensions.b);
                          if (height < bird.minDimensions.h) setHeight(bird.minDimensions.h);
                        }}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-50/60 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-2xl">{bird.icon}</span>
                          <span className="text-xs font-black text-slate-900">
                            {bird.price > 0 ? formatCurrency(bird.price) : 'Free / Excluded'}
                          </span>
                        </div>
                        <div className="mt-3">
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">{bird.name}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{bird.species}</p>
                          <span className="text-[10px] font-mono text-emerald-700 block mt-2">
                            Min: {bird.minDimensions.l}&quot; × {bird.minDimensions.b}&quot; × {bird.minDimensions.h}&quot;
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setActiveTab('cage')}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center space-x-2 transition-all"
                  >
                    <span>Next: Configure Cage Dimensions</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: CAGE SIZING & FINISH */}
            {activeTab === 'cage' && (
              <div className="space-y-6 animate-in fade-in-50">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                    <Ruler className="w-5 h-5 text-amber-500" />
                    <span>Cage Dimensions & Sizing</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Set bespoke Length, Breadth, and Height. Recommended minimum for {selectedBird.name} is{' '}
                    <strong className="text-slate-800">
                      {selectedBird.minDimensions.l} × {selectedBird.minDimensions.b} × {selectedBird.minDimensions.h} inches
                    </strong>
                    .
                  </p>
                </div>

                {/* Unit Switcher */}
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700">Measurement Units:</span>
                  <div className="flex space-x-1">
                    {(['in', 'ft', 'cm'] as const).map((u) => (
                      <button
                        key={u}
                        onClick={() => setUnit(u)}
                        className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                          unit === u ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {u === 'in' ? 'Inches (in)' : u === 'ft' ? 'Feet (ft)' : 'Centimeters (cm)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dimension Sliders & Inputs */}
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-xs font-extrabold mb-1.5">
                      <span className="text-slate-700">Length (Width / Frontage)</span>
                      <span className="text-emerald-600 font-mono text-sm">{length} {unit}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min={unit === 'ft' ? 1 : unit === 'cm' ? 30 : 12}
                        max={unit === 'ft' ? 8 : unit === 'cm' ? 240 : 84}
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        className="flex-1 accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                      />
                      <input
                        type="number"
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        className="w-20 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 rounded-xl px-2.5 py-1.5 text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-extrabold mb-1.5">
                      <span className="text-slate-700">Breadth (Depth)</span>
                      <span className="text-emerald-600 font-mono text-sm">{breadth} {unit}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min={unit === 'ft' ? 1 : unit === 'cm' ? 25 : 10}
                        max={unit === 'ft' ? 6 : unit === 'cm' ? 180 : 60}
                        value={breadth}
                        onChange={(e) => setBreadth(Number(e.target.value))}
                        className="flex-1 accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                      />
                      <input
                        type="number"
                        value={breadth}
                        onChange={(e) => setBreadth(Number(e.target.value))}
                        className="w-20 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 rounded-xl px-2.5 py-1.5 text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-extrabold mb-1.5">
                      <span className="text-slate-700">Height (Vertical)</span>
                      <span className="text-emerald-600 font-mono text-sm">{height} {unit}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min={unit === 'ft' ? 1 : unit === 'cm' ? 30 : 12}
                        max={unit === 'ft' ? 8 : unit === 'cm' ? 240 : 84}
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="flex-1 accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                      />
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-20 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 rounded-xl px-2.5 py-1.5 text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Material Selection */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <span className="text-xs font-black uppercase text-slate-800 tracking-wider block">
                    Frame & Wire Construction Material
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setMaterial('powder_coated')}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                        material === 'powder_coated'
                          ? 'bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-900">Powder-Coated Metal Wire</span>
                        <span className="text-xs font-mono font-bold text-amber-700">₹110 / sq ft</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Heavy-duty non-toxic electrostatically powder coated. Lightweight and rust resistant.
                      </p>
                    </div>

                    <div
                      onClick={() => setMaterial('stainless_steel')}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                        material === 'stainless_steel'
                          ? 'bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-900">100% Medical Stainless Steel</span>
                        <span className="text-xs font-mono font-bold text-amber-700">₹180 / sq ft</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        100% lifetime rust-proof, chew-proof, non-toxic surgical grade for exotic aviaries.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Wire Spacing & Color Finish */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="text-xs font-black text-slate-800 block mb-2">Wire Bar Spacing</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: '0.5', label: '0.5" (Small Birds)' },
                        { id: '0.75', label: '0.75" (Medium)' },
                        { id: '1.0', label: '1.0" (Parrots)' },
                      ].map((sp) => (
                        <button
                          key={sp.id}
                          onClick={() => setWireSpacing(sp.id as any)}
                          className={`p-2 rounded-xl text-center text-xs font-bold border transition-all ${
                            wireSpacing === sp.id
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {sp.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-800 block mb-2">Coating Finish Color</label>
                    <div className="flex items-center space-x-2">
                      {COLOR_OPTIONS.map((col) => (
                        <button
                          key={col.id}
                          onClick={() => setColorFinish(col)}
                          title={col.name}
                          className={`w-9 h-9 rounded-xl border-2 transition-all flex items-center justify-center ${
                            colorFinish.id === col.id ? 'ring-2 ring-emerald-500 scale-110 shadow-md' : 'opacity-80'
                          }`}
                          style={{ backgroundColor: col.hex }}
                        >
                          {colorFinish.id === col.id && (
                            <Check className={`w-4 h-4 ${col.id === 'white' ? 'text-slate-900' : 'text-white'}`} />
                          )}
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 block mt-1.5">{colorFinish.name}</span>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setActiveTab('bird')}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    ← Back to Birds
                  </button>
                  <button
                    onClick={() => setActiveTab('accessories')}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center space-x-2 transition-all"
                  >
                    <span>Next: Select Swings & Toys</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: ACCESSORIES & ENRICHMENT */}
            {activeTab === 'accessories' && (
              <div className="space-y-6 animate-in fade-in-50">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-teal-600" />
                    <span>Select Enrichment Swings, Toys & Calcium</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Choose from authentic wooden perches, chew toys, D-swings, cuttlefish bones, and nests.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {ACCESSORY_OPTIONS.map((item) => {
                    const isSelected = selectedAccessories.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleAccessory(item.id)}
                        className={`cursor-pointer rounded-2xl p-3 border transition-all flex items-center space-x-3 ${
                          isSelected
                            ? 'bg-teal-50/70 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-16 h-16 rounded-xl bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                          <Image src={item.img} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                              {item.type}
                            </span>
                            <span className="text-xs font-black text-slate-900">
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{item.name}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                            {isSelected ? '✓ Added to Habitat' : '+ Tap to include'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setActiveTab('cage')}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    ← Back to Cage Dimensions
                  </button>
                  <button
                    onClick={() => setActiveTab('food')}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center space-x-2 transition-all"
                  >
                    <span>Next: Choose Nutrition Diet</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: NUTRITION PACK */}
            {activeTab === 'food' && (
              <div className="space-y-6 animate-in fade-in-50">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                    <PackagePlus className="w-5 h-5 text-amber-500" />
                    <span>Choose Daily Gourmet Nutrition</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Select wholesome triple-cleaned seed mixes to start your bird off with optimal nutrition.
                  </p>
                </div>

                <div className="space-y-3">
                  {NUTRITION_OPTIONS.map((f) => {
                    const isSelected = selectedFood.id === f.id;
                    return (
                      <div
                        key={f.id}
                        onClick={() => setSelectedFood(f)}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-center space-x-4 ${
                          isSelected
                            ? 'bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {f.img ? (
                          <div className="w-16 h-16 rounded-xl bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                            <Image src={f.img} alt={f.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold shrink-0">
                            ✕
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">{f.name}</h4>
                            <span className="text-xs font-black text-slate-900">
                              {f.price > 0 ? formatCurrency(f.price) : 'No Charge'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{f.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setActiveTab('accessories')}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    ← Back to Swings & Toys
                  </button>
                  <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                    <Check className="w-4 h-4" />
                    <span>Configuration Complete! Ready to Order.</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Visual 2D Canvas & Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Live Interactive Visual 2D Cage Preview */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono uppercase text-amber-400 font-extrabold flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Live 2D Habitat Visualizer</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">{dimensionsLabel}</span>
              </div>

              {/* Graphical Cage Container */}
              <div className="w-full h-64 bg-slate-950 rounded-2xl relative overflow-hidden border-2 border-slate-800 flex items-center justify-center p-4">
                {/* Visual Cage Frame */}
                <div
                  className="relative transition-all duration-500 rounded-xl shadow-inner flex flex-col justify-between p-3"
                  style={{
                    width: `${Math.min(95, Math.max(50, (lInches / 48) * 90))}%`,
                    height: `${Math.min(90, Math.max(50, (hInches / 48) * 85))}%`,
                    border: `4px solid ${colorFinish.hex}`,
                    backgroundImage: `repeating-linear-gradient(0deg, ${colorFinish.hex}44, ${colorFinish.hex}44 1px, transparent 1px, transparent 12px), repeating-linear-gradient(90deg, ${colorFinish.hex}22, ${colorFinish.hex}22 1px, transparent 1px, transparent 24px)`,
                  }}
                >
                  {/* Top Hanging Attachment Hook */}
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-3 rounded-t-full border-t-2 border-x-2"
                    style={{ borderColor: colorFinish.hex }}
                  />

                  {/* Hanging Toys thumbnails inside cage */}
                  <div className="flex justify-around items-start w-full px-2 pt-1">
                    {selectedAccessories.slice(0, 3).map((accId) => {
                      const acc = ACCESSORY_OPTIONS.find((a) => a.id === accId);
                      if (!acc) return null;
                      return (
                        <div
                          key={accId}
                          className="flex flex-col items-center animate-in zoom-in duration-300"
                          title={acc.name}
                        >
                          <div className="w-0.5 h-4 bg-slate-400" />
                          <div className="w-8 h-8 rounded-lg bg-white overflow-hidden shadow-md border border-slate-300">
                            <Image src={acc.img} alt={acc.name} width={32} height={32} className="object-cover" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Perch bar with Bird */}
                  <div className="relative my-auto w-full flex items-center justify-center">
                    {/* Natural Wooden Perch */}
                    <div className="w-full h-2 bg-amber-800 rounded-full shadow-md relative flex items-center justify-center">
                      {/* Perched Bird */}
                      {selectedBird.id !== 'none' && (
                        <div className="absolute -top-9 flex flex-col items-center group">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden border border-white/40 shadow-lg flex items-center justify-center">
                            {selectedBird.img ? (
                              <Image
                                src={selectedBird.img}
                                alt={selectedBird.name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-xl">{selectedBird.icon}</span>
                            )}
                          </div>
                          <span className="text-[9px] font-bold text-white bg-slate-900/80 px-1.5 py-0.5 rounded-md -mt-1 shadow">
                            {selectedBird.species.split(' ')[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Tray & Food Dish */}
                  <div className="flex justify-between items-end w-full px-2 pb-1">
                    {/* Food Cup */}
                    {selectedFood.id !== 'none' && (
                      <div className="w-6 h-4 bg-amber-400/90 rounded-b-lg border border-amber-500 shadow-sm flex items-center justify-center text-[7px] text-slate-900 font-black">
                        Seed
                      </div>
                    )}
                    {/* Pull-out tray indicator */}
                    <div
                      className="h-1.5 w-3/4 mx-auto rounded-sm opacity-80"
                      style={{ backgroundColor: colorFinish.hex }}
                    />
                  </div>
                </div>
              </div>

              {/* Habitat Insights */}
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Surface Area:</span>
                  <span className="font-mono font-bold text-white">{sqFeet.toFixed(1)} sq ft</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Color Finish:</span>
                  <span className="font-bold text-white flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: colorFinish.hex }} />
                    <span>{colorFinish.name}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Wire Spacing:</span>
                  <span className="font-bold text-white">{wireSpacing} inch safety gap</span>
                </div>
              </div>
            </div>

            {/* 2. Order Summary & Action Buttons */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
                Habitat Build Summary
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Bespoke Cage ({dimensionsLabel})</span>
                  <span className="font-bold text-slate-900">{formatCurrency(cagePrice)}</span>
                </div>

                {selectedBird.id !== 'none' && (
                  <div className="flex justify-between text-slate-600">
                    <span>Companion: {selectedBird.name}</span>
                    <span className="font-bold text-slate-900">{formatCurrency(birdPrice)}</span>
                  </div>
                )}

                {selectedAccessories.length > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Accessories ({selectedAccessories.length} items)</span>
                    <span className="font-bold text-slate-900">{formatCurrency(accessoriesTotal)}</span>
                  </div>
                )}

                {selectedFood.id !== 'none' && (
                  <div className="flex justify-between text-slate-600">
                    <span>Diet: {selectedFood.name}</span>
                    <span className="font-bold text-slate-900">{formatCurrency(foodPrice)}</span>
                  </div>
                )}

                {bundleDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold pt-1 border-t border-dashed border-slate-200">
                    <span>Starter Bundle Discount</span>
                    <span>-{formatCurrency(bundleDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span className="text-xl text-emerald-600">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all"
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5 text-white animate-bounce" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add Complete Habitat Setup to Cart</span>
                    </>
                  )}
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Enquire / Order Custom Setup on WhatsApp</span>
                </a>
              </div>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-400 flex items-center justify-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Certified non-toxic materials • Handcrafted in Bengaluru</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
