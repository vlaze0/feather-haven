'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const res = await fetch('/api/reviews?all=true');
    const data = await res.json();
    if (data.reviews) setReviews(data.reviews);
  };

  const handleToggleApprove = async (reviewId: string, currentStatus: boolean) => {
    await fetch('/api/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId, isApproved: !currentStatus }),
    });
    fetchReviews();
  };

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-slate-800">
        <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Feedback Control</span>
        <h1 className="text-3xl font-black text-white mt-1">Review Approvals</h1>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center justify-between text-xs gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-sm">{rev.customerName}</span>
                <div className="flex items-center text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-slate-300 italic">"{rev.comment}"</p>
              {rev.bird && <span className="text-[10px] text-emerald-400 font-mono block">Bird: {rev.bird.name}</span>}
              {rev.product && <span className="text-[10px] text-sky-400 font-mono block">Product: {rev.product.name}</span>}
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => handleToggleApprove(rev.id, rev.isApproved)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  rev.isApproved
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                }`}
              >
                {rev.isApproved ? 'Approved' : 'Approve Review'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
