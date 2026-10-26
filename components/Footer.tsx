'use client'

import { content } from '@/lib/content'
import { ArrowRight, Leaf } from 'lucide-react'
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
  const columns = [
    {
      title: 'Características',
      links: (t.features ?? []).map((feature) => ({
        label: feature.title,
        href: `/caracteristicas/${getFeatureSlug(feature.id, 'es')}`,
      })),
    },
    {
      title: 'Alternativas',
      links: (t.competitors ?? []).map((competitor) => ({
        label: `Alternativa a ${competitor.name}`,
        href: `/alternativa/${getAlternativeSlug(competitor.id, 'es')}`,
      })),
    },
    { title: 'Legal', links: legalLinks },
  ]

  return (
    <footer className="bg-[#0b0b0b] pt-20 pb-10 text-white sm:pt-28">
      <div className="mx-auto w-[min(1400px,calc(100%-48px))] md:w-[min(1400px,calc(100%-80px))]">
        <div className="flex flex-col justify-between gap-10 border-b border-white/15 pb-16 lg:flex-row lg:items-end">
          <p className="max-w-2xl text-[clamp(32px,4vw,56px)] leading-[1.02] font-medium tracking-[-0.045em]">
            Grandes ideas empiezan en pequeños negocios.
          </p>
          <Link
            href="/crear-pagina-web-negocio"
            className="inline-flex min-h-12 w-fit items-center gap-2.5 rounded-full bg-white px-6 text-[15px] font-medium text-black transition-colors hover:bg-[#e9e9e4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Crear mi web
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex w-fit items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-white">
                <Leaf className="size-4 text-black" aria-hidden="true" />
              </span>
              <span className="text-xl font-semibold tracking-[-0.04em]">
                {t.footer.logo}
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/55">
              Tu próxima etapa empieza con una web. Creada con IA, pensada para
              negocios locales.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-5 text-sm font-medium text-white/45">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-3 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/85 transition-colors hover:text-white hover:underline hover:underline-offset-4"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/15 pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} Bunnatic · Hecho con cariño en
            Barcelona
          </p>
          <CookiePreferencesButton />
        </div>
      </div>
    </footer>
  )
}
