'use client';

import { useEffect, useRef, useState } from 'react';
import { css } from '../../../styled-system/css';
import { AdPlaceholder } from './AdPlaceholder';
import { useAds } from './AdProvider';

interface AdRailProps {
  adSlot?: string;
  position: 'left' | 'right';
  size?: 'wide' | 'narrow';
  className?: string;
  testMode?: boolean;
}

/**
 * Vertical rail ad component for desktop sidebar
 * Supports sizes: narrow (160x600) or wide (300x600)
 * Hidden on mobile devices
 *
 * Usage:
 * ```tsx
 * <AdRail adSlot="1234567890" position="right" size="wide" />
 * ```
 */
export function AdRail({
  adSlot,
  position,
  size = 'narrow',
  className,
  testMode = false,
}: AdRailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { config, isLoaded, pushAd } = useAds();
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);

  const width = size === 'wide' ? '300px' : '160px';
  const height = '600px';

  // Lazy load
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Push ad when visible
  useEffect(() => {
    if (isVisible && isLoaded && config.enabled && adSlot && !hasError) {
      try {
        pushAd();
      } catch {
        setHasError(true);
      }
    }
  }, [isVisible, isLoaded, config.enabled, adSlot, pushAd, hasError]);

  // Don't render if ads disabled
  if (!config.enabled) {
    return null;
  }

  return (
    <aside
      ref={containerRef}
      className={`${css({
        width,
        minWidth: width,
        position: 'sticky',
        top: '80px',
        height: 'fit-content',
        display: { base: 'none', lg: 'block' },
        ...(position === 'left'
          ? { marginRight: '4', order: -1 }
          : { marginLeft: '4', order: 1 }
        ),
      })} ${className || ''}`}
    >
      {testMode || !adSlot ? (
        <AdPlaceholder
          width={width}
          height={height}
          label={`Rail ${position} ${adSlot ? `(${adSlot})` : ''}`}
        />
      ) : hasError ? (
        <AdPlaceholder width={width} height={height} label="Anúncio indisponível" />
      ) : isVisible ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width, height }}
          data-ad-client={config.publisherId}
          data-ad-slot={adSlot}
        />
      ) : (
        <AdPlaceholder width={width} height={height} label="Carregando..." />
      )}
    </aside>
  );
}
