'use client'

import Link from 'next/link'
import { ArrowRight, Leaf, Sparkles } from 'lucide-react'
import { trackFunnelEvent } from '@/lib/funnelEvents'

export default function FinalCTA() {
  return (
    <section className="bg-white px-5 pb-12 sm:px-10">
      <div className="relative mx-auto max-w-[1240px] overflow-hidden rounded-2xl bg-[#29452e] px-6 py-16 text-center text-white sm:py-20">
        <Leaf
          className="pointer-events-none absolute -top-10 -left-10 size-64 -rotate-12 text-[#90ae6d]/10"
          strokeWidth={0.6}
          aria-hidden="true"
        />
        <Leaf
          className="pointer-events-none absolute -right-10 -bottom-16 size-80 rotate-150 text-[#90ae6d]/10"
          strokeWidth={0.6}
          aria-hidden="true"
        />
        <div className="relative">
          <p className="mb-5 inline-flex items-center gap-2 text-[10px] font-medium tracking-[.16em] text-[#bbce9e] uppercase">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Tu próximo capítulo empieza aquí
          </p>
          <h2 className="text-4xl leading-tight font-medium tracking-[-.04em] sm:text-5xl">
            Ya tienes un gran negocio.
            <br />
            <span className="font-serif font-normal text-[#c8dda6] italic">
              Ahora, dale una gran web.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#bfccb3]">
            Más cerca de tus clientes. Más fiel a tu esencia.
            <br />Y mucho más fácil de lo que imaginas.
          </p>
          <Link
            href="/crear-pagina-web-negocio"
            onClick={() =>
              trackFunnelEvent('landing_cta_click', {
                placement: 'final_cta',
                locale: 'es',
              })
            }
            className="mt-8 inline-flex min-h-12 items-center gap-6 rounded-lg bg-[#d6e7b8] px-6 py-3 text-sm font-semibold text-[#344d2a] transition-colors hover:bg-[#e4efcf]"
          >
            Crear mi web gratis
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <p className="mt-4 text-[10px] text-[#aabc98]">
            Sin tarjeta · Sin complicaciones · A tu ritmo
          </p>
        </div>
      </div>
    </section>
  )
}
