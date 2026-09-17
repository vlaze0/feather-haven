'use client';

import { useState, useEffect } from 'react';

/**
 * Detects whether the app is running as a PWA/standalone app (installed APK via TWA,
 * or "Add to Home Screen") vs. a regular browser website.
 *
 * - Website mode: full header, footer, traditional web layout
 * - App mode: bottom nav, compact header, no footer — native app feel
 */
export function useAppMode(): { isApp: boolean; isLoaded: boolean } {
  const [isApp, setIsApp] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. CSS media query: display-mode: standalone (Android TWA / PWA)
    const mqStandalone = window.matchMedia('(display-mode: standalone)');
    const mqFullscreen = window.matchMedia('(display-mode: fullscreen)');

    // 2. iOS Safari "Add to Home Screen"
    const iosStandalone = (navigator as any).standalone === true;

    // 3. Android TWA — document.referrer is often 'android-app://...'
    const isTWA = document.referrer.startsWith('android-app://');

    // 4. URL param override: ?mode=app (useful for testing & APK WebView)
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get('mode');

    // 5. localStorage override (once set via ?mode=app, persists)
    const storedMode = localStorage.getItem('fh_app_mode');

    const detected =
      mqStandalone.matches ||
      mqFullscreen.matches ||
      iosStandalone ||
      isTWA ||
      modeParam === 'app' ||
      storedMode === 'app';

    // Persist mode if set via URL param
    if (modeParam === 'app') {
      localStorage.setItem('fh_app_mode', 'app');
    } else if (modeParam === 'web') {
      localStorage.removeItem('fh_app_mode');
    }

    setIsApp(detected);
    setIsLoaded(true);

    // Listen for changes (e.g. user installs PWA while browsing)
    const handleChange = () => {
      if (mqStandalone.matches || mqFullscreen.matches) {
        setIsApp(true);
      }
    };
    mqStandalone.addEventListener('change', handleChange);

    return () => {
      mqStandalone.removeEventListener('change', handleChange);
    };
  }, []);

  return { isApp, isLoaded };
}
