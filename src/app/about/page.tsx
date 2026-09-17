import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bird, ShieldCheck, Heart, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-10 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 sm:p-12 rounded-3xl shadow-xl text-center max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Our Story & Aviary Philosophy</span>
          <h1 className="text-3xl sm:text-5xl font-black">About Feather Haven</h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Founded with a passion for avian health, Feather Haven is India's leading ethical bird shop and specialized aviary. We connect bird lovers with healthy, hand-reared parakeets, budgies, and top-grade supplies.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">100% Vet Checked</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every single bird undergoes strict veterinary screening, 14-day quarantine observation, and de-worming before being offered for adoption.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Non-Toxic Enclosures</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We stock only certified lead-free, powder-coated wrought iron cages to guarantee zero heavy metal poisoning for chewing birds.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center font-bold">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Lifetime Care Advice</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our avian experts are available via WhatsApp to guide you on diet adjustments, behavior, finger taming, and cage setup.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
