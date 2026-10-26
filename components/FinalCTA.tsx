'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { trackFunnelEvent } from '@/lib/funnelEvents'

export default function FinalCTA() {
  return (
    <section className="home-dark relative isolate overflow-hidden bg-black text-white">
      <Image
        src="/images/salon.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-45"
      />
      <div className="home-container flex min-h-[80svh] flex-col items-center justify-center py-28 text-center">
        <h2 className="max-w-5xl text-[clamp(44px,7vw,108px)] leading-[0.95] font-medium tracking-[-0.055em] text-balance">
          Ya tienes un gran negocio. Ahora, dale una gran web.
        </h2>
        <Link
          href="/crear-pagina-web-negocio"
          onClick={() =>
            trackFunnelEvent('landing_cta_click', {
              placement: 'final_cta',
              locale: 'es',
            })
          }
          className="home-button home-button-light mt-12"
        >
          Comenzar gratis
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <p className="mt-5 text-sm text-white/70">
          No necesitas tarjeta de crédito. Cancela cuando quieras.
        </p>
      </div>
    </section>
  )
}
