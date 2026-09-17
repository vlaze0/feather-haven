import React from 'react';
import { prisma } from '@/lib/prisma';
import BirdCard from '@/components/birds/BirdCard';
import BirdFilterBar from '@/components/birds/BirdFilterBar';
import Link from 'next/link';
import { Search, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default async function BirdsPage({
  searchParams,
}: {
  searchParams: {
    search?: string;
    species?: string;
    variety?: string;
    status?: string;
    gender?: string;
    color?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  };
}) {
  const { search, species, variety, status, gender, color, minPrice, maxPrice, sort } = searchParams;

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { species: { contains: search } },
      { variety: { contains: search } },
      { birdCode: { contains: search } },
      { color: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (species && species !== 'ALL') {
    where.species = { contains: species };
  }

  if (variety && variety !== 'ALL') {
    where.variety = { contains: variety };
  }

  if (status && status !== 'ALL') {
    where.status = status;
  }

  if (gender && gender !== 'ALL') {
    where.gender = gender;
  }

  if (color && color !== 'ALL') {
    where.color = { contains: color };
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };
  if (sort === 'oldest') orderBy = { createdAt: 'asc' };

  const birdsRaw = await prisma.bird.findMany({
    where,
    orderBy,
  });

  const birds = birdsRaw.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
  }));

  // Species Categories List
  const speciesList = [
    { name: 'ALL', label: 'All Birds', icon: '🦜' },
    { name: 'Budgerigar / Parakeet', label: 'Budgies', icon: '🐦' },
    { name: 'Lovebird', label: 'Lovebirds', icon: '❤️' },
    { name: 'Cockatiel', label: 'Cockatiels', icon: '👑' },
    { name: 'Sun Conure', label: 'Sun Conures', icon: '☀️' },
    { name: 'Finch', label: 'Finches', icon: '🌈' },
  ];

  // Complete 23 Budgie Varieties Spectrum
  const budgieVarieties = [
    'Normal Green',
    'Sky Blue',
    'Cobalt Blue',
    'Mauve',
    'Violet',
    'Grey',
    'Lutino',
    'Albino',
    'Pied',
    'Spangle',
    'Opaline',
    'Cinnamon',
    'Clearwing',
    'Greywing',
    'Dilute',
    'Yellowface',
    'Goldenface',
    'Texas Clearbody',
    'Lacewing',
    'Crested',
    'English Exhibition',
    'Rainbow',
    'Hagoromo / Helicopter',
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title Banner */}
        <div className="mb-8 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-900/50">
          <div>
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Aviary Pet Categories & 23 Budgie Varieties</span>
            </span>
            <h1 className="text-3xl font-black text-white mt-1">Live Birds & Parakeets</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Browse Budgies (all 23 varieties including Japanese Hagoromo Helicopter), Lovebirds, Cockatiels, Sun Conures & Finches. Each bird is health-certified and available with gender selection before cart addition.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-center shrink-0">
            <span className="text-2xl font-black text-emerald-400 block">{birds.length}</span>
            <span className="text-[10px] font-bold uppercase text-slate-300">Birds Available</span>
          </div>
        </div>

        {/* Filter Controls Bar (Species + 23 Budgie Varieties) */}
        <BirdFilterBar
          speciesList={speciesList}
          budgieVarieties={budgieVarieties}
          currentSpecies={species}
          currentVariety={variety}
          currentStatus={status}
          currentSort={sort}
          currentSearch={search}
        />

        {/* Birds Grid */}
        {birds.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No birds found matching this variety or filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try selecting another Budgie variety or species category above.</p>
            <Link
              href="/birds"
              className="mt-6 inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md"
            >
              Reset All Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {birds.map((bird: any) => (
              <BirdCard key={bird.id} bird={bird} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
