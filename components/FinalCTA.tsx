'use client'

import { content } from '@/lib/content'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { trackFunnelEvent } from '@/lib/funnelEvents'

export default function FinalCTA() {
  const t = content
  const targetPath = '/crear-pagina-web-negocio'

  return (
    <section className="bg-emerald-900 py-16 text-center sm:py-24 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
          <span className="block">{t.finalCta.title}</span>
          <span className="block text-emerald-300">{t.finalCta.subtitle}</span>
        </h2>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10">
          <Link
            href={targetPath}
            onClick={() =>
              trackFunnelEvent('landing_cta_click', {
                placement: 'final_cta',
                locale: 'es',
              })
            }
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-base font-bold text-emerald-900 transition-colors hover:bg-emerald-50 sm:px-8 sm:py-4 sm:text-lg"
          >
            {t.finalCta.cta.replace(' →', '')}
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-sm font-medium text-emerald-200/80">
            {t.finalCta.trustText}
          </p>
        </div>
      </div>
    </section>
  )
}
