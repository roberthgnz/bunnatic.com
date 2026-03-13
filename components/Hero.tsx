'use client'

import { content } from '@/lib/content'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { trackFunnelEvent } from '@/lib/funnelEvents'

export default function Hero() {
  const t = content
  const targetPath = '/crear-pagina-web-negocio'

  return (
    <section className="border-b border-slate-200 bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <span className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800 sm:text-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
          <span className="leading-tight">
            {t.hero.badge.replace('✦ ', '')}
          </span>
        </span>

        <h1 className="mt-7 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-[5rem] lg:leading-[1.05]">
          <span className="block">{t.hero.titleLine1}</span>
          <span className="block">{t.hero.titleLine2}</span>
          <span className="block text-emerald-700">{t.hero.titleLine3}</span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
          {t.hero.subtitle}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <Link
            href={targetPath}
            onClick={() =>
              trackFunnelEvent('landing_cta_click', {
                placement: 'hero',
                locale: 'es',
              })
            }
            className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-emerald-800 sm:px-8 sm:py-4 sm:text-lg"
          >
            {t.hero.cta.replace(' →', '')}
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-sm font-medium text-slate-500">
            {t.hero.trustText}
          </p>
        </div>
      </div>
    </section>
  )
}
