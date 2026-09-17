'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, Filter, Sparkles, X } from 'lucide-react';

interface SpeciesOption {
  name: string;
  label: string;
  icon: string;
}

export default function BirdFilterBar({
  speciesList,
  budgieVarieties,
  lovebirdVarieties = [
    'Peach-faced',
    'Fischer’s',
    'Masked',
    'Lutino',
    'Albino',
    'Creamino',
    'Blue',
    'Cobalt Blue',
    'Violet',
    'Pied',
    'Opaline',
    'Cinnamon',
    'Seagreen',
    'Turquoise',
    'Whiteface',
    'Orange-face',
    'Yellow-faced',
  ],
  cockatielVarieties = ['Lutino', 'Normal Grey', 'Pearl', 'Pied', 'Albino Whiteface'],
  sunConureVarieties = ['Normal', 'High Yellow', 'Pied', 'White-beak Pied', 'Yellow Pied'],
  finchVarieties = ['Java Sparrow', 'Owl Finch', 'White Finch'],
  currentSpecies,
  currentVariety,
  currentStatus,
  currentSort,
  currentSearch,
}: {
  speciesList: SpeciesOption[];
  budgieVarieties: string[];
  lovebirdVarieties?: string[];
  cockatielVarieties?: string[];
  sunConureVarieties?: string[];
  finchVarieties?: string[];
  currentSpecies?: string;
  currentVariety?: string;
  currentStatus?: string;
  currentSort?: string;
  currentSearch?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'ALL') {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset variety if species changes
    if (key === 'species') {
      params.delete('variety');
    }

    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(targetUrl, { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchVal = formData.get('search') as string;
    updateFilters('search', searchVal.trim() || null);
  };

  const isLovebirdActive = currentSpecies && currentSpecies.toLowerCase().includes('lovebird');
  const isCockatielActive = currentSpecies && currentSpecies.toLowerCase().includes('cockatiel');
  const isSunConureActive = currentSpecies && currentSpecies.toLowerCase().includes('conure');
  const isFinchActive = currentSpecies && currentSpecies.toLowerCase().includes('finch');

  let activeVarietiesList = budgieVarieties;
  let varietyLabel = 'Budgie Varieties (23 Spectrum)';

  if (isLovebirdActive) {
    activeVarietiesList = lovebirdVarieties;
    varietyLabel = 'Lovebird Varieties (17 Verified Spectrum)';
  } else if (isCockatielActive) {
    activeVarietiesList = cockatielVarieties;
    varietyLabel = 'Cockatiel Varieties (5 Verified Spectrum)';
  } else if (isSunConureActive) {
    activeVarietiesList = sunConureVarieties;
    varietyLabel = 'Sun Conure Varieties (5 Verified Spectrum)';
  } else if (isFinchActive) {
    activeVarietiesList = finchVarieties;
    varietyLabel = 'Finch Varieties (3 Verified Spectrum)';
  }

  return (
    <div className="space-y-6 mb-8">
      {/* 1. Main Species Category Selection Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center space-x-1.5">
            <span>🦜 Select Pet Bird Species:</span>
          </span>
          {currentSpecies && currentSpecies !== 'ALL' && (
            <button
              onClick={() => updateFilters('species', null)}
              className="text-[11px] font-bold text-rose-600 hover:underline flex items-center space-x-1"
            >
              <X className="w-3 h-3" />
              <span>Clear Species Filter</span>
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {speciesList.map((sp) => {
            const isSelected =
              (!currentSpecies && sp.name === 'ALL') ||
              (currentSpecies && currentSpecies.toLowerCase().includes(sp.name.toLowerCase()));

            return (
              <button
                key={sp.name}
                onClick={() => updateFilters('species', sp.name)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-200 shrink-0 flex items-center space-x-2 border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.02]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span className="text-sm">{sp.icon}</span>
                <span>{sp.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Specific Variety Selection Bar (Dynamically toggles Budgie vs Lovebird vs Cockatiel vs Sun Conure vs Finch) */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
              {varietyLabel}
            </span>
          </div>

          {currentVariety && currentVariety !== 'ALL' && (
            <button
              onClick={() => updateFilters('variety', null)}
              className="text-[11px] font-bold text-rose-600 hover:underline flex items-center space-x-1"
            >
              <X className="w-3 h-3" />
              <span>Clear Variety Filter</span>
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => updateFilters('variety', null)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
              !currentVariety || currentVariety === 'ALL'
                ? 'bg-amber-500 text-slate-950 font-black border-amber-500 shadow-sm'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            ✨ All Varieties
          </button>

          {activeVarietiesList.map((varName) => {
            const isSelected = currentVariety && currentVariety.toLowerCase() === varName.toLowerCase();
            return (
              <button
                key={varName}
                onClick={() => updateFilters('variety', varName)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {varName}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Search & Sort Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            name="search"
            defaultValue={currentSearch || ''}
            placeholder="Search by variety, color, or ref code..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>

        {/* Sort & Availability Selectors */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={currentStatus || 'ALL'}
            onChange={(e) => updateFilters('status', e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available Only</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
          </select>

          <select
            value={currentSort || 'newest'}
            onChange={(e) => updateFilters('sort', e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
