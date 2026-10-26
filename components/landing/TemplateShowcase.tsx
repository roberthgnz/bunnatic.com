'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Globe2,
  MapPin,
  Monitor,
  Smartphone,
  Sparkles,
} from 'lucide-react'
import { trackFunnelEvent } from '@/lib/funnelEvents'
import { siteExamples } from '@/lib/siteExamples'
import SitePreview from '@/components/landing/SitePreview'

const startingPoints = [
  {
    icon: MapPin,
    title: 'Desde tu ficha de Google',
    text: 'Busca tu negocio y la IA reúne tus datos y servicios para empezar.',
    cta: 'Crear con IA',
  },
  {
    icon: Globe2,
    title: 'Desde tu web actual',
    text: 'Comparte la dirección de tu web y la convertimos en una versión más clara y moderna.',
    cta: 'Renovar mi web',
  },
]

export default function TemplateShowcase() {
  const [activeExample, setActiveExample] = useState(0)
  const [mobile, setMobile] = useState(false)
  const example = siteExamples[activeExample]

  return (
    <section
      id="plantillas"
      className="home-dark home-section bg-[#0b0b0b] text-white"
    >
      <div className="home-container">
        <div className="max-w-4xl">
          <p className="home-eyebrow text-white/55!">
            <Sparkles className="mr-2 inline size-4" aria-hidden="true" />
            No hace falta tener experiencia
          </p>
          <h2 className="home-title">
            Empezar nunca ha sido tan fácil gracias a la IA.
          </h2>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.6fr)] lg:gap-20">
          <div className="flex flex-col">
            <p className="text-lg leading-relaxed text-white/65">
              Elige un sector y mira cómo quedaría. Tu web se crea a partir de
              tu propia información.
            </p>
            <div
              className="mt-8 border-t border-white/15 pt-4"
              role="group"
              aria-label="Sector de la web de ejemplo"
            >
              {siteExamples.map((item, index) => (
                <button
                  key={item.slug}
                  type="button"
                  aria-pressed={activeExample === index}
                  onClick={() => setActiveExample(index)}
                  className="home-template-tab"
                >
                  {item.sector}
                </button>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-4 lg:mt-auto">
              <Link
                href="/crear-pagina-web-negocio"
                onClick={() =>
                  trackFunnelEvent('landing_cta_click', {
                    placement: 'template_showcase',
                    locale: 'es',
                  })
                }
                className="home-button home-button-light"
              >
                Empieza con este estilo
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href={`/ejemplos/${example.slug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white"
              >
                Ver {example.name}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="min-w-0">
            <div
              className={`hero-browser ${mobile ? 'hero-browser-mobile' : ''}`}
            >
              <div className="flex h-10 items-center gap-3 border-b border-[#e8e9df] bg-white px-3 text-black">
                <div className="flex gap-1" aria-hidden="true">
                  <span className="size-2 rounded-full bg-black/15" />
                  <span className="size-2 rounded-full bg-black/15" />
                  <span className="size-2 rounded-full bg-black/15" />
                </div>
                <span className="flex min-w-0 flex-1 items-center justify-center gap-1.5 truncate text-[11px] text-black/50">
                  <Globe2 className="size-3 shrink-0" aria-hidden="true" />
                  {example.name.toLowerCase().replaceAll(' ', '')}.bunnatic.com
                </span>
                <div
                  className="flex gap-0.5"
                  role="group"
                  aria-label="Dispositivo de vista previa"
                >
                  <button
                    type="button"
                    aria-label="Vista de escritorio"
                    aria-pressed={!mobile}
                    onClick={() => setMobile(false)}
                    className={`rounded p-1.5 ${!mobile ? 'bg-black/10 text-black' : 'text-black/40'}`}
                  >
                    <Monitor className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Vista de móvil"
                    aria-pressed={mobile}
                    onClick={() => setMobile(true)}
                    className={`rounded p-1.5 ${mobile ? 'bg-black/10 text-black' : 'text-black/40'}`}
                  >
                    <Smartphone className="size-3.5" />
                  </button>
                </div>
              </div>
              <div aria-live="polite" aria-atomic="true">
                <SitePreview example={example} mobile={mobile} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-2">
          {startingPoints.map(({ icon: Icon, title, text, cta }) => (
            <Link
              key={title}
              href="/crear-pagina-web-negocio"
              className="group flex flex-col rounded-3xl bg-white/[0.06] p-8 transition-colors hover:bg-white/10 sm:p-10"
            >
              <Icon className="size-6 text-white/70" aria-hidden="true" />
              <h3 className="mt-10 text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
                {title}
              </h3>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-white/60">
                {text}
              </p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                {cta}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
