import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { BookOpen, Clock, ArrowLeft } from 'lucide-react';

export const revalidate = 0;

export default async function CareGuideDetailPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link href="/care-guides" className="inline-flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-emerald-600">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Care Guides</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">{post.title}</h1>
            <p className="text-xs text-slate-400 font-mono flex items-center space-x-2 pt-2">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
              <span>•</span>
              <span>Published by Feather Haven Avian Team</span>
            </p>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md">
            <Image src={post.image} alt={post.title} fill className="object-cover" priority />
          </div>

          <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line pt-4 border-t border-slate-100">
            {post.content}
          </div>
        </div>
      </div>
    </div>
  );
}
