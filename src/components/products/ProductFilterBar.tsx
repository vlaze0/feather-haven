'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, Sparkles, X } from 'lucide-react';

export default function ProductFilterBar({
  typesList,
  currentType,
  currentSearch,
  currentSort,
  categoryTitle,
}: {
  typesList: string[];
  currentType?: string;
  currentSearch?: string;
  currentSort?: string;
  categoryTitle: string;
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

  return (
    <div className="space-y-6 mb-8">
      {/* 1. Sub-Category / Type Selector Pills */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
              {categoryTitle} Categories & Types
            </span>
          </div>

          {currentType && currentType !== 'ALL' && (
            <button
              onClick={() => updateFilters('type', null)}
              className="text-[11px] font-bold text-rose-600 hover:underline flex items-center space-x-1"
            >
              <X className="w-3 h-3" />
              <span>Clear Type Filter</span>
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => updateFilters('type', null)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all shrink-0 border ${
              !currentType || currentType === 'ALL'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.02]'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            ✨ All Items
          </button>

          {typesList.map((tName) => {
            const isSelected = currentType && currentType.toLowerCase() === tName.toLowerCase();
            return (
              <button
                key={tName}
                onClick={() => updateFilters('type', tName)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {tName}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Search & Sort Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            name="search"
            defaultValue={currentSearch || ''}
            placeholder={`Search ${categoryTitle.toLowerCase()} by name, brand, material...`}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={currentSort || 'newest'}
            onChange={(e) => updateFilters('sort', e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="newest">Sort: Featured & Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
