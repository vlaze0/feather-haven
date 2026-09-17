import React from 'react';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/products/ProductCard';
import ProductFilterBar from '@/components/products/ProductFilterBar';
import CustomCageCalculator from '@/components/products/CustomCageCalculator';
import Link from 'next/link';
import { Search, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default async function AccessoriesPage({
  searchParams,
}: {
  searchParams?: {
    type?: string;
    search?: string;
    sort?: string;
  };
}) {
  const typeParam = searchParams?.type;
  const searchParam = searchParams?.search;
  const sortParam = searchParams?.sort;

  const categories = await prisma.category.findMany({
    where: { slug: { in: ['accessories', 'cages'] } },
  });

  const categoryIds = categories.map((c) => c.id);

  const where: any = { categoryId: { in: categoryIds } };

  if (searchParam) {
    where.OR = [
      { name: { contains: searchParam } },
      { description: { contains: searchParam } },
      { brand: { contains: searchParam } },
      { suitableFor: { contains: searchParam } },
      { material: { contains: searchParam } },
    ];
  }

  if (typeParam && typeParam !== 'ALL') {
    if (typeParam === 'All Cages') {
      const cageCat = categories.find((c) => c.slug === 'cages');
      if (cageCat) where.categoryId = cageCat.id;
    } else if (typeParam === 'Customised Cages') {
      where.OR = [
        { name: { contains: 'Custom' } },
        { name: { contains: 'Customised' } },
        { description: { contains: 'custom' } },
      ];
    } else if (typeParam === 'Nest Boxes & Nests') {
      where.OR = [
        { name: { contains: 'Nest' } },
        { name: { contains: 'Nesting' } },
        { description: { contains: 'nest' } },
        { description: { contains: 'hut' } },
        { description: { contains: 'pot' } },
      ];
    } else if (typeParam === 'Toys & Swings') {
      where.OR = [
        { name: { contains: 'Toy' } },
        { name: { contains: 'Swing' } },
        { name: { contains: 'Ladder' } },
        { description: { contains: 'chewing' } },
      ];
    } else if (typeParam === 'Cuttlefish & Calcium') {
      where.OR = [
        { name: { contains: 'Cuttlefish' } },
        { name: { contains: 'Calcium' } },
        { description: { contains: 'bone' } },
      ];
    } else {
      where.OR = [
        { name: { contains: typeParam } },
        { description: { contains: typeParam } },
        { suitableFor: { contains: typeParam } },
      ];
    }
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sortParam === 'price_asc') orderBy = { price: 'asc' };
  if (sortParam === 'price_desc') orderBy = { price: 'desc' };

  const productsRaw = await prisma.product.findMany({
    where,
    include: { category: true, images: true },
    orderBy,
  });

  const products = productsRaw.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));

  const accessoryTypes = [
    'All Cages',
    'Customised Cages',
    'Nest Boxes & Nests',
    'Toys & Swings',
    'Cuttlefish & Calcium',
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-teal-900/40">
          <div>
            <span className="text-xs font-mono uppercase text-teal-400 font-bold flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Cages, Nesting, Play & Habitat Supplies</span>
            </span>
            <h1 className="text-3xl font-black text-white mt-1">Bird Accessories, Cages, Nest Boxes & Toys</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Discover authentic bird cages (Customised Built-to-Order, Small, Medium, Pink & Stainless Steel), handcrafted nest boxes, interactive wooden swings, and pure cuttlefish calcium blocks.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-center shrink-0">
            <span className="text-2xl font-black text-teal-400 block">{products.length}</span>
            <span className="text-[10px] font-bold uppercase text-slate-300">Items Available</span>
          </div>
        </div>

        {/* Filter Bar Component */}
        <ProductFilterBar
          typesList={accessoryTypes}
          currentType={typeParam}
          currentSearch={searchParam}
          currentSort={sortParam}
          categoryTitle="Accessories & Cages"
        />

        {/* INTERACTIVE CUSTOM CAGE CALCULATOR COMPONENT - Shown ONLY when Customised Cages filter option is selected */}
        {(typeParam === 'Customised Cages' || typeParam?.toLowerCase().includes('custom')) && (
          <CustomCageCalculator />
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No items found matching your filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try selecting another subcategory or clearing search terms.</p>
            <Link
              href="/accessories"
              className="mt-6 inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
