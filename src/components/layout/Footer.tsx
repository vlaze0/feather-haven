'use client';

import React from 'react';
import Link from 'next/link';
import { Bird, Phone, Mail, MapPin, Heart, ShieldCheck, Truck, RefreshCw, MessageSquare } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/utils';
import { useAppMode } from '@/lib/use-app-mode';

export default function Footer() {
  const { isApp } = useAppMode();

  // Hide footer in app mode — app uses bottom navigation instead
  if (isApp) {
    return null;
  }

  const whatsappUrl = generateWhatsAppLink(
    '919876543210',
    'Hello Feather Haven, I am visiting your website and have a question.'
  );

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* 1. Value Proposition Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Healthy Aviary</h4>
              <p className="text-xs text-slate-400">Vet certified & de-wormed</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Safe Delivery</h4>
              <p className="text-xs text-slate-400">Climate-controlled transit</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Quality Guarantee</h4>
              <p className="text-xs text-slate-400">Organic food & safe cages</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">WhatsApp Support</h4>
              <p className="text-xs text-slate-400">Direct bird care advice</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand info */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg">
              <Bird className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              Feather<span className="text-emerald-400">Haven</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            India’s premier dynamic bird shop and aviary. We specialize in healthy, hand-reared budgies, parakeets, exotic birds, spacious non-toxic cages, gourmet seed mixes, and interactive bird toys.
          </p>
          <div className="pt-2 flex items-center space-x-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Quick Shop */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Explore Shop</h4>
          <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
            <li>
              <Link href="/birds" className="hover:text-emerald-400 transition-colors">
                Available Birds & Budgies
              </Link>
            </li>
            <li>
              <Link href="/food" className="hover:text-emerald-400 transition-colors">
                Nutritious Bird Food
              </Link>
            </li>
            <li>
              <Link href="/accessories" className="hover:text-emerald-400 transition-colors">
                Accessories, Cages & Toys
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-emerald-400 transition-colors">
                About Feather Haven
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-emerald-400 transition-colors flex items-center space-x-1 font-semibold text-emerald-400">
                <span>Dashboard Console</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Customer Care</h4>
          <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
            <li>
              <Link href="/policies/live-bird-policy" className="hover:text-emerald-400 transition-colors">
                Live Bird Purchase Policy
              </Link>
            </li>
            <li>
              <Link href="/policies/shipping-policy" className="hover:text-emerald-400 transition-colors">
                Shipping & Delivery Rules
              </Link>
            </li>
            <li>
              <Link href="/policies/privacy-policy" className="hover:text-emerald-400 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/policies/terms-conditions" className="hover:text-emerald-400 transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                Contact & Shop Visit
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Store Location</h4>
          <ul className="space-y-3 text-xs text-slate-400">
            <li className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Royal Palm Arcade, MG Road, Bengaluru, KA 560001</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>hello@featherhaven.in</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Bottom Credits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 Feather Haven Aviary & Bird Shop. All rights reserved.</p>
        <p className="flex items-center space-x-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for bird lovers nationwide.</span>
        </p>
      </div>
    </footer>
  );
}
