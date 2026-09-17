import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';

export const revalidate = 0;

export default async function CareGuidesPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 sm:p-10 rounded-3xl shadow-xl">
          <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Avian Health Knowledge</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">Bird Care Guides & Manuals</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
            Everything you need to know about parakeet nutrition, cage placement, finger taming, health checks, and feather grooming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/care-guides/${post.slug}`}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                  {post.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg mt-1 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3">{post.excerpt}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs font-bold text-emerald-600 flex items-center space-x-1">
                  <span>Read Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
