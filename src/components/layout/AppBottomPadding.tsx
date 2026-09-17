'use client';

import { useAppMode } from '@/lib/use-app-mode';

/**
 * Adds bottom padding to <main> content only in app mode,
 * so the bottom navigation bar doesn't overlap content.
 */
export default function AppBottomPadding() {
  const { isApp } = useAppMode();

  if (!isApp) return null;

  return <div className="h-20" aria-hidden="true" />;
}
