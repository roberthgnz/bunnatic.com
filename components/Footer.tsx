'use client'

import { content } from '@/lib/content'
import { Zap } from 'lucide-react'
import Link from 'next/link'
import {
  getAlternativeSlug,
  getFeatureSlug,
  getLegalSlug,
} from '@/lib/pageSlugs'
import { CookiePreferencesButton } from '@/components/CookiePreferencesButton'

export default function Footer() {
  const t = content
  const legalLinks = [
    {
      label: 'Aviso legal',
      href: `/${getLegalSlug('aviso-legal', 'es')}`,
    },
    {
      label: 'Política de privacidad',
      href: `/${getLegalSlug('politica-privacidad', 'es')}`,
    },
    {
      label: 'Política de cookies',
      href: `/${getLegalSlug('politica-cookies', 'es')}`,
    },
  ]

  return (
    <footer className="border-t border-slate-200 bg-slate-100 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100">
                <Zap className="h-5 w-5 fill-emerald-700 text-emerald-700" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                {t.footer.logo}
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed font-medium text-slate-600">
              La IA crea tu web usando los datos de tu negocio. Gratis para
              empezar.
            </p>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold tracking-wider text-slate-900 uppercase">
              Características
            </h3>
            <ul className="flex flex-col gap-4 text-sm font-medium text-slate-600">
              {t.features?.map((feature) => (
                <li key={feature.id}>
                  <Link
                    href={`/caracteristicas/${getFeatureSlug(feature.id, 'es')}`}
                    className="transition-colors hover:text-slate-900"
                  >
                    {feature.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold tracking-wider text-slate-900 uppercase">
              Alternativas
            </h3>
            <ul className="flex flex-col gap-4 text-sm font-medium text-slate-600">
              {t.competitors?.map((competitor) => (
                <li key={competitor.id}>
                  <Link
                    href={`/alternativa/${getAlternativeSlug(competitor.id, 'es')}`}
                    className="transition-colors hover:text-slate-900"
                  >
                    Alternativa a {competitor.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold tracking-wider text-slate-900 uppercase">
              Legal
            </h3>
            <ul className="flex flex-col gap-4 text-sm font-medium text-slate-600">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <div className="text-sm font-medium text-slate-500">
            {t.footer.copyright}
          </div>
          <CookiePreferencesButton />
        </div>
      </div>
    </footer>
  )
}
