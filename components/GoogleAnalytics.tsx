'use client';

import {Suspense, useEffect, useRef, useState} from 'react';
import {usePathname, useSearchParams} from 'next/navigation';
import Script from 'next/script';
import {COOKIE_CONSENT_EVENT, hasAnalyticsConsent} from '@/lib/cookieConsent';

declare global {
  interface Window {
    ga?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type GoogleAnalyticsProps = {
  trackingId: string;
};

export function GoogleAnalytics(props: GoogleAnalyticsProps) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsContent {...props} />
    </Suspense>
  );
}

function GoogleAnalyticsContent({trackingId}: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initializedRef = useRef(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const isGa4 = trackingId.startsWith('G-');

  const ensureGtagStub = () => {
    if (typeof window === 'undefined') {
      return;
    }

    window.dataLayer = window.dataLayer ?? [];

    if (typeof window.gtag !== 'function') {
      window.gtag = (...args: unknown[]) => {
        window.dataLayer?.push(args);
      };
    }
  };

  useEffect(() => {
    const syncConsent = () => {
      const consentGranted = hasAnalyticsConsent();
      setHasConsent(consentGranted);

      if (typeof window !== 'undefined') {
        const windowFlags = window as unknown as Record<string, unknown>;
        windowFlags[`ga-disable-${trackingId}`] = !consentGranted;

        if (consentGranted) {
          ensureGtagStub();
        }
      }
    };

    syncConsent();
    window.addEventListener(COOKIE_CONSENT_EVENT, syncConsent);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, syncConsent);
    };
  }, [trackingId]);

  useEffect(() => {
    if (!hasConsent || !scriptLoaded || typeof window === 'undefined') {
      return;
    }

    if (initializedRef.current) {
      return;
    }

    const windowFlags = window as unknown as Record<string, unknown>;
    windowFlags[`ga-disable-${trackingId}`] = false;

    if (isGa4) {
      ensureGtagStub();
      window.gtag?.('js', new Date());
      window.gtag?.('config', trackingId, {send_page_view: false});
    } else {
      if (typeof window.ga !== 'function') {
        return;
      }

      window.ga('create', trackingId, 'auto');
    }

    initializedRef.current = true;
  }, [hasConsent, isGa4, scriptLoaded, trackingId]);

  useEffect(() => {
    if (
      !hasConsent ||
      !initializedRef.current ||
      typeof window === 'undefined'
    ) {
      return;
    }

    const query = searchParams.toString();
    const page = query ? `${pathname}?${query}` : pathname;

    if (isGa4) {
      window.gtag?.('event', 'page_view', {page_path: page});
      return;
    }

    if (typeof window.ga !== 'function') {
      return;
    }

    window.ga('set', 'page', page);
    window.ga('send', 'pageview');
  }, [hasConsent, isGa4, pathname, searchParams]);

  if (!hasConsent) {
    return null;
  }

  return (
    <Script
      id="google-analytics"
      strategy="afterInteractive"
      src={
        isGa4
          ? `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(trackingId)}`
          : 'https://www.google-analytics.com/analytics.js'
      }
      onLoad={() => setScriptLoaded(true)}
    />
  );
}
