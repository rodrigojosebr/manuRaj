'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdConfig {
  enabled: boolean;
  publisherId?: string;
  adUnitIds?: string[];
}

interface AdContextType {
  config: AdConfig;
  isLoaded: boolean;
  pushAd: () => void;
}

const AdContext = createContext<AdContextType | null>(null);

interface AdProviderProps {
  children: ReactNode;
  config: AdConfig;
}

/**
 * AdProvider - Manages Google AdSense initialization and ad loading
 *
 * Usage:
 * ```tsx
 * <AdProvider config={{ enabled: true, publisherId: 'ca-pub-XXXXX' }}>
 *   <App />
 * </AdProvider>
 * ```
 */
export function AdProvider({ children, config }: AdProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!config.enabled || !config.publisherId) {
      return;
    }

    // Check if script is already loaded
    if (document.querySelector('script[src*="adsbygoogle"]')) {
      setIsLoaded(true);
      return;
    }

    // Initialize adsbygoogle array
    window.adsbygoogle = window.adsbygoogle || [];

    // Load AdSense script
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.publisherId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => setIsLoaded(true);
    script.onerror = () => console.error('Failed to load AdSense script');

    document.head.appendChild(script);

    return () => {
      // Cleanup is not typically needed for AdSense
    };
  }, [config.enabled, config.publisherId]);

  const pushAd = () => {
    if (isLoaded && config.enabled) {
      try {
        window.adsbygoogle.push({});
      } catch (error) {
        console.error('AdSense push error:', error);
      }
    }
  };

  return (
    <AdContext.Provider value={{ config, isLoaded, pushAd }}>
      {children}
    </AdContext.Provider>
  );
}

/**
 * Hook to access ad context
 */
export function useAds() {
  const context = useContext(AdContext);
  if (!context) {
    // Return default values when not wrapped in AdProvider
    return {
      config: { enabled: false },
      isLoaded: false,
      pushAd: () => {},
    };
  }
  return context;
}

/**
 * Get publisher ID from environment
 */
export function getPublisherId(): string | undefined {
  return process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
}
