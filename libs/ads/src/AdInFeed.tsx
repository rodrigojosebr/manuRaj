'use client';

import { useEffect, useRef, useState } from 'react';
import { css } from '../../../styled-system/css';
import { AdPlaceholder } from './AdPlaceholder';
import { useAds } from './AdProvider';

interface AdInFeedProps {
  adSlot?: string;
  layoutKey?: string;
  className?: string;
  testMode?: boolean;
}

/**
 * In-feed ad component for content lists
 * Matches the style of surrounding content
 *
 * Usage:
 * ```tsx
 * // Between list items
 * {items.map((item, i) => (
 *   <>
 *     <ListItem key={item.id} {...item} />
 *     {i === 2 && <AdInFeed adSlot="1234567890" />}
 *   </>
 * ))}
 * ```
 */
export function AdInFeed({
  adSlot,
  layoutKey = '-fb+5w+4e-db+86',
  className,
  testMode = false,
}: AdInFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { config, isLoaded, pushAd } = useAds();
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);

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
      { rootMargin: '50px' }
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

  if (!config.enabled) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`${css({
        width: '100%',
        minHeight: '100px',
        padding: '3',
        marginY: '2',
        borderRadius: 'md',
        backgroundColor: 'gray.50',
      })} ${className || ''}`}
    >
      {testMode || !adSlot ? (
        <AdPlaceholder height="100px" label={`In-feed ${adSlot ? `(${adSlot})` : ''}`} />
      ) : hasError ? (
        <AdPlaceholder height="100px" label="Anúncio indisponível" />
      ) : isVisible ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={config.publisherId}
          data-ad-slot={adSlot}
          data-ad-format="fluid"
          data-ad-layout-key={layoutKey}
        />
      ) : (
        <AdPlaceholder height="100px" label="Carregando..." />
      )}
    </div>
  );
}
