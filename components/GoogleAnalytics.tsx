'use client';

import {Suspense, useEffect, useRef, useState} from 'react';
import {usePathname, useSearchParams} from 'next/navigation';
import Script from 'next/script';
import {COOKIE_CONSENT_EVENT, hasAnalyticsConsent} from '@/lib/cookieConsent';

declare global {
  interface Window {
    ga?: (...args: unknown[]) => void;
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

  useEffect(() => {
    const syncConsent = () => {
      const consentGranted = hasAnalyticsConsent();
      setHasConsent(consentGranted);

      if (!consentGranted && typeof window !== 'undefined') {
        const windowFlags = window as unknown as Record<string, unknown>;
        windowFlags[`ga-disable-${trackingId}`] = true;
      }
    };

    syncConsent();
    window.addEventListener(COOKIE_CONSENT_EVENT, syncConsent);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, syncConsent);
    };
  }, [trackingId]);

  useEffect(() => {
    if (!hasConsent || !scriptLoaded || typeof window === 'undefined' || typeof window.ga !== 'function') {
      return;
    }

    if (initializedRef.current) {
      return;
    }

    const windowFlags = window as unknown as Record<string, unknown>;
    windowFlags[`ga-disable-${trackingId}`] = false;
    window.ga('create', trackingId, 'auto');
    initializedRef.current = true;
  }, [hasConsent, scriptLoaded, trackingId]);

  useEffect(() => {
    if (
      !hasConsent ||
      !initializedRef.current ||
      typeof window === 'undefined' ||
      typeof window.ga !== 'function'
    ) {
      return;
    }

    const query = searchParams.toString();
    const page = query ? `${pathname}?${query}` : pathname;

    window.ga('set', 'page', page);
    window.ga('send', 'pageview');
  }, [hasConsent, pathname, searchParams]);

  if (!hasConsent) {
    return null;
  }

  return (
    <Script
      id="google-analytics"
      strategy="afterInteractive"
      src="https://www.google-analytics.com/analytics.js"
      onLoad={() => setScriptLoaded(true)}
    />
  );
}
