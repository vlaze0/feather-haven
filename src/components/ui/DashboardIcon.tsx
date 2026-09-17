'use client';

import React from 'react';
import { LayoutDashboard } from 'lucide-react';

interface DashboardIconProps {
  className?: string;
  size?: number;
  badge?: boolean;
}

export default function DashboardIcon({ className = "w-5 h-5 text-emerald-600", size, badge }: DashboardIconProps) {
  return (
    <div className="relative inline-flex items-center justify-center">
      <LayoutDashboard className={className} size={size} />
      {badge && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
      )}
    </div>
  );
}
