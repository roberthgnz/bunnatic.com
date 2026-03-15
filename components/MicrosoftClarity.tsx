'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { COOKIE_CONSENT_EVENT, getCookieConsent } from '@/lib/cookieConsent'

export function MicrosoftClarity() {
  useEffect(() => {
    const updateConsent = () => {
      const consent = getCookieConsent()
      if (typeof window !== 'undefined' && 'clarity' in window) {
        if (consent?.analytics) {
          ; (window as any).clarity('consentv2', {
            ad_Storage: 'granted',
            analytics_Storage: 'granted',
          })
        } else {
          ; (window as any).clarity('consentv2', {
            ad_Storage: 'denied',
            analytics_Storage: 'denied',
          })
            ; (window as any).clarity('consent', false) // Explicitly erase clarity session
        }
      }
    }

    // Set initial state after mount
    updateConsent()

    // Listen for changes
    window.addEventListener(COOKIE_CONSENT_EVENT, updateConsent)

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, updateConsent)
    }
  }, [])

  return (
    <Script
      id="microsoft-clarity-init"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vvuk4fl8sb");
        `,
      }}
    />
  )
}
