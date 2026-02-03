'use client';

import { useEffect, useRef, useState } from 'react';
import { css } from '../../../styled-system/css';
import { AdPlaceholder } from './AdPlaceholder';
import { useAds } from './AdProvider';

interface AdBannerProps {
  adSlot?: string;
  format?: 'horizontal' | 'rectangle' | 'auto';
  className?: string;
  testMode?: boolean;
}

/**
 * Horizontal banner ad component
 * Supports multiple formats: horizontal (728x90), rectangle (336x280), auto (responsive)
 *
 * Usage:
 * ```tsx
 * <AdBanner adSlot="1234567890" format="horizontal" />
 * ```
 */
export function AdBanner({
  adSlot,
  format = 'horizontal',
  className,
  testMode = false,
}: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { config, isLoaded, pushAd } = useAds();
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Lazy load - only load ad when visible
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

  // Push ad when visible and loaded
  useEffect(() => {
    if (isVisible && isLoaded && config.enabled && adSlot && !hasError) {
      try {
        pushAd();
      } catch {
        setHasError(true);
      }
    }
  }, [isVisible, isLoaded, config.enabled, adSlot, pushAd, hasError]);

  const getHeight = () => {
    switch (format) {
      case 'horizontal': return '90px';
      case 'rectangle': return '280px';
      default: return 'auto';
    }
  };

  const getWidth = () => {
    switch (format) {
      case 'horizontal': return '728px';
      case 'rectangle': return '336px';
      default: return '100%';
    }
  };

  // Don't render if ads disabled
  if (!config.enabled) {
    return null;
  }

  // Test mode - show placeholder with info
  if (testMode || !adSlot) {
    return (
      <div
        ref={containerRef}
        className={`${css({
          width: '100%',
          maxWidth: getWidth(),
          margin: '0 auto',
        })} ${className || ''}`}
      >
        <AdPlaceholder
          height={getHeight()}
          label={`Banner ${format} ${adSlot ? `(${adSlot})` : ''}`}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${css({
        width: '100%',
        maxWidth: getWidth(),
        minHeight: getHeight(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '16px auto',
        overflow: 'hidden',
      })} ${className || ''}`}
    >
      {hasError ? (
        <AdPlaceholder height={getHeight()} label="Anúncio indisponível" />
      ) : isVisible ? (
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            width: format === 'auto' ? '100%' : getWidth(),
            height: format === 'auto' ? 'auto' : getHeight(),
          }}
          data-ad-client={config.publisherId}
          data-ad-slot={adSlot}
          data-ad-format={format === 'auto' ? 'auto' : undefined}
          data-full-width-responsive={format === 'auto' ? 'true' : undefined}
        />
      ) : (
        <AdPlaceholder height={getHeight()} label="Carregando..." />
      )}
    </div>
  );
}
