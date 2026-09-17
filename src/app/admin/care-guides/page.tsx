import React from 'react';
import { prisma } from '@/lib/prisma';
import { FileText, Plus, Clock } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminCareGuidesPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Content Editor</span>
          <h1 className="text-3xl font-black text-white mt-1">Bird Care Guides</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
              {post.category}
            </span>
            <h3 className="font-bold text-white text-base">{post.title}</h3>
            <p className="text-xs text-slate-400 line-clamp-2">{post.excerpt}</p>
            <span className="text-[10px] text-slate-500 font-mono block">{post.readTime}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
