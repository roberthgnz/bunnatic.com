'use client'

import { content } from '@/lib/content'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { usePathname } from 'next/navigation'
import { trackFunnelEvent } from '@/lib/funnelEvents'

export default function FinalCTA() {
  const { language } = useLanguage()
  const t = content[language]
  const pathname = usePathname() ?? '/'
  const locale = pathname.split('/').filter(Boolean)[0]
  const hasLocale = locale === 'es' || locale === 'ca'
  const targetPath = hasLocale
    ? `/${locale}/crear-pagina-web-negocio`
    : '/crear-pagina-web-negocio'

  return (
    <section className="border-b border-slate-200 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            {t.finalCta.title}
          </h2>
          <p className="mt-5 text-xl leading-8 font-bold text-emerald-800 sm:text-3xl">
            {t.finalCta.subtitle}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-5">
            <Link
              href={targetPath}
              onClick={() =>
                trackFunnelEvent('landing_cta_click', {
                  placement: 'final_cta',
                  locale: language,
                })
              }
              className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-emerald-800"
            >
              {t.finalCta.cta.replace(' →', '')}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-sm font-medium text-slate-500">
              {t.finalCta.trustText}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
