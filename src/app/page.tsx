import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import BirdCard from '@/components/birds/BirdCard';
import ProductCard from '@/components/products/ProductCard';
import BirdFilterBar from '@/components/birds/BirdFilterBar';
import {
  Bird,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  Star,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const revalidate = 0; // Dynamic rendering for fresh database content

export default async function HomePage({
  searchParams,
}: {
  searchParams?: {
    species?: string;
    variety?: string;
    status?: string;
    sort?: string;
  };
}) {
  const speciesParam = searchParams?.species;
  const varietyParam = searchParams?.variety;
  const statusParam = searchParams?.status;
  const sortParam = searchParams?.sort;

  // Fetch Site Settings
  const settingsRecords = await prisma.siteSetting.findMany();
  const settingsMap: Record<string, string> = {};
  settingsRecords.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  const heroTitle = settingsMap.hero_title || 'Find Your Perfect Feathered Companion';
  const heroSubtitle =
    settingsMap.hero_subtitle ||
    'Healthy, hand-reared Budgies (all 23 varieties including Hagoromo Helicopter), Lovebirds, Cockatiels, Sun Conures & Finches, non-toxic cages, and gourmet food delivered safely to your doorstep.';

  // Build query for Homepage Birds
  const birdWhere: any = {};
  if (speciesParam && speciesParam !== 'ALL') {
    birdWhere.species = { contains: speciesParam };
  }
  if (varietyParam && varietyParam !== 'ALL') {
    birdWhere.variety = { contains: varietyParam };
  }
  if (statusParam && statusParam !== 'ALL') {
    birdWhere.status = statusParam;
  }

  // Fetch Birds
  const featuredBirdsRaw = await prisma.bird.findMany({
    where: birdWhere,
    orderBy: { createdAt: 'desc' },
  });

  const featuredBirds = featuredBirdsRaw.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
  }));

  // Fetch Featured Products (Limit 8)
  const featuredProductsRaw = await prisma.product.findMany({
    where: { isFeatured: true },
    include: { category: true, images: true },
    take: 8,
  });

  const featuredProducts = featuredProductsRaw.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));

  // Fetch Blog Posts
  const blogPosts = await prisma.blogPost.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  // Fetch Customer Reviews
  const reviews = await prisma.review.findMany({
    where: { isApproved: true },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  const speciesList = [
    { name: 'ALL', label: 'All Birds', icon: '🦜' },
    { name: 'Budgerigar / Parakeet', label: 'Budgies', icon: '🐦' },
    { name: 'Lovebird', label: 'Lovebirds', icon: '❤️' },
    { name: 'Cockatiel', label: 'Cockatiels', icon: '👑' },
    { name: 'Sun Conure', label: 'Sun Conures', icon: '☀️' },
    { name: 'Finch', label: 'Finches', icon: '🌈' },
  ];

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
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-850 text-white pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Certified Healthy Aviary & Pet Store</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
                {heroTitle.split(' ').map((word, i) =>
                  word.toLowerCase() === 'feathered' || word.toLowerCase() === 'perfect' ? (
                    <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-yellow-300">
                      {word}{' '}
                    </span>
                  ) : (
                    word + ' '
                  )
                )}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/birds"
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Bird className="w-5 h-5" />
                  <span>Shop Birds & Budgies</span>
                </Link>
                <Link
                  href="/cages"
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm px-8 py-4 rounded-2xl border border-slate-700 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Explore Cages & Supplies</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs font-semibold text-slate-400">
                <div className="flex items-center space-x-2 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Vet Check Certified</span>
                </div>
                <div className="flex items-center space-x-2 justify-center lg:justify-start">
                  <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Safe Animal Transit</span>
                </div>
                <div className="flex items-center space-x-2 justify-center lg:justify-start">
                  <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Lifetime Care Advice</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card Stack */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 group">
                <Image
                  src="/images/birds/hagoromo_1.png"
                  alt="Hagoromo Helicopter Budgie"
                  fill
                  unoptimized
                  className="object-cover object-[center_15%] group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">Featured Rare Mutation</span>
                    <h4 className="font-bold text-sm text-white">Hagoromo Helicopter Budgie</h4>
                    <p className="text-xs text-slate-300">6 Months • Male • Flower Swirl Wings</p>
                  </div>
                  <span className="text-lg font-black text-emerald-400">₹3,500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Pet Species & 23 Budgie Varieties Section */}
      <section id="pet-birds-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
            Live Pet Birds & Varieties
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-1">Select Bird Species & Budgie Varieties</h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose from Budgies (all 23 varieties including Hagoromo Helicopter), Lovebirds, Cockatiels, Sun Conures & Finches. Click any bird to select gender & add to cart!
          </p>
        </div>

        {/* Pet Filter Bar Component */}
        <BirdFilterBar
          speciesList={speciesList}
          budgieVarieties={budgieVarieties}
          currentSpecies={speciesParam}
          currentVariety={varietyParam}
          currentStatus={statusParam}
          currentSort={sortParam}
        />

        {/* Birds Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredBirds.map((bird: any) => (
            <BirdCard key={bird.id} bird={bird} />
          ))}
        </div>
      </section>

      {/* 3. Shop Supplies by Category */}
      <section className="bg-emerald-50/50 py-16 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">Browse Collections</span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">Shop Everything Your Bird Needs</h2>
            <p className="text-xs text-slate-500 mt-2">
              From non-toxic wrought iron cages to organic seed blends and toys.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/birds"
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-md border border-slate-100 flex flex-col justify-end p-6"
            >
              <Image
                src="/images/birds/hagoromo_1.png"
                alt="Available Birds"
                fill
                unoptimized
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <div className="relative z-10 space-y-1 text-white">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 px-2 py-0.5 rounded-md text-slate-950">
                  Live Aviary
                </span>
                <h3 className="text-xl font-extrabold">Birds & Budgies</h3>
                <p className="text-xs text-slate-300 line-clamp-2">Parakeets, budgies, lovebirds, and cockatiels.</p>
                <div className="pt-2 text-xs font-bold text-emerald-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>View All Birds</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            <Link
              href="/cages"
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-md border border-slate-100 flex flex-col justify-end p-6"
            >
              <Image
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80"
                alt="Bird Cages"
                fill
                unoptimized
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <div className="relative z-10 space-y-1 text-white">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-sky-500 px-2 py-0.5 rounded-md text-white">
                  Safe Enclosures
                </span>
                <h3 className="text-xl font-extrabold">Bird Cages</h3>
                <p className="text-xs text-slate-300 line-clamp-2">Dome top, flight, breeding, and travel cages.</p>
                <div className="pt-2 text-xs font-bold text-sky-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Shop All Cages</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            <Link
              href="/food"
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-md border border-slate-100 flex flex-col justify-end p-6"
            >
              <Image
                src="/images/products/seed_mix_11_15_grains.webp"
                alt="Bird Food & Seeds"
                fill
                unoptimized
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <div className="relative z-10 space-y-1 text-white">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 px-2 py-0.5 rounded-md text-slate-950">
                  Gourmet Diet
                </span>
                <h3 className="text-xl font-extrabold">Bird Food & Seeds</h3>
                <p className="text-xs text-slate-300 line-clamp-2">Authentic seed & fortified multi-seed mix blends.</p>
                <div className="pt-2 text-xs font-bold text-amber-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Explore Nutrition</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            <Link
              href="/accessories"
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-md border border-slate-100 flex flex-col justify-end p-6"
            >
              <Image
                src="/images/products/toy_chewing_swing.jpg"
                alt="Accessories & Toys"
                fill
                unoptimized
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <div className="relative z-10 space-y-1 text-white">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-teal-500 px-2 py-0.5 rounded-md text-slate-950">
                  Enrichment
                </span>
                <h3 className="text-xl font-extrabold">Accessories & Toys</h3>
                <p className="text-xs text-slate-300 line-clamp-2">Perches, swings, nesting boxes, and cuttlefish bones.</p>
                <div className="pt-2 text-xs font-bold text-teal-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>View Accessories</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Cages & Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
              Essential Pet Supplies
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">Popular Cages, Food & Toys</h2>
            <p className="text-xs text-slate-500 mt-1">Tested for bird safety and non-toxic durability.</p>
          </div>
          <Link
            href="/cages"
            className="inline-flex items-center space-x-2 text-emerald-700 hover:text-emerald-800 font-extrabold text-sm group"
          >
            <span>View All Store Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Bird Care Educational Guides */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                Educational Care Guides
              </span>
              <h2 className="text-3xl font-black text-white mt-1">Bird Care Knowledge Base</h2>
              <p className="text-xs text-slate-400 mt-1">
                Learn expert advice on parakeet diet, cage setup, finger taming, and health checks.
              </p>
            </div>
            <Link
              href="/care-guides"
              className="inline-flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 font-extrabold text-sm"
            >
              <span>Read All Care Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/care-guides/${post.slug}`}
                className="bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 hover:border-emerald-500/50 transition-all group flex flex-col justify-between"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">{post.readTime}</span>
                    <h3 className="font-bold text-white text-base mt-1 group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">{post.excerpt}</p>
                  </div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
