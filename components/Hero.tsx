'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  Globe2,
  Monitor,
  Search,
  Smartphone,
  Sparkles,
} from 'lucide-react'
import { trackFunnelEvent } from '@/lib/funnelEvents'
import { siteExamples } from '@/lib/siteExamples'
import SitePreview from '@/components/landing/SitePreview'

export default function Hero() {
  const [activeExample, setActiveExample] = useState(0)
  const [mobile, setMobile] = useState(false)
  const example = siteExamples[activeExample]

  return (
    <section className="landing-hero">
      <div className="landing-container grid items-center gap-12 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:py-20">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#dce3d5] bg-[#eef2e7] px-3 py-1.5 text-[11px] font-semibold text-[#496143]">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Pequeños negocios. Grandes posibilidades.
          </div>
          <h1 className="hero-title">
            Tu negocio.
            <br />
            Tu esencia.
            <br />
            <span className="font-serif font-normal text-[#52734a] italic">
              Tu nueva web.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-[#687064] sm:text-lg">
            Tú pones el negocio. La IA pone la web.
            <br className="hidden sm:block" /> Crea tu espacio online en minutos
            y haz que más clientes te encuentren.
          </p>
          <form
            action="/crear-pagina-web-negocio"
            method="get"
            className="hero-search mt-8"
            onSubmit={() =>
              trackFunnelEvent('landing_cta_click', {
                placement: 'hero_search',
                locale: 'es',
              })
            }
          >
            <label htmlFor="hero-business" className="sr-only">
              Nombre de tu negocio y ciudad
            </label>
            <Search
              className="ml-4 size-4 shrink-0 text-[#7a8273]"
              aria-hidden="true"
            />
            <input
              id="hero-business"
              name="q"
              type="search"
              maxLength={200}
              placeholder="¿Cómo se llama tu negocio?"
              className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm outline-none placeholder:text-[#899080]"
            />
            <button
              type="submit"
              className="landing-button shrink-0 gap-2 px-4! text-sm!"
            >
              Crear mi web <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-[#77806e]">
            {['Demo gratis', 'Sin tarjeta', 'Sin saber programar'].map(
              (item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <Check className="size-3 text-[#52734a]" aria-hidden="true" />
                  {item}
                </span>
              )
            )}
          </div>
          <Link
            href="#ejemplos"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#344a2e] underline decoration-[#b7c3a9] underline-offset-4"
          >
            Primero quiero ver ejemplos
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="hero-showcase relative min-w-0 pb-9 lg:pt-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
            <div
              className="flex gap-1"
              role="group"
              aria-label="Sector de la web de ejemplo"
            >
              {siteExamples.map((item, index) => (
                <button
                  key={item.slug}
                  type="button"
                  aria-pressed={activeExample === index}
                  onClick={() => setActiveExample(index)}
                  className={`example-tab ${activeExample === index ? 'example-tab-active' : ''}`}
                >
                  {item.sector}
                </button>
              ))}
            </div>
            <span className="flex items-center gap-1.5 text-[10px] text-[#7b8272]">
              <span className="size-1.5 rounded-full bg-[#789660]" />
              Vista de ejemplo
            </span>
          </div>
          <div
            className={`hero-browser ${mobile ? 'hero-browser-mobile' : ''}`}
          >
            <div className="flex h-10 items-center gap-3 border-b border-[#e8e9df] bg-white px-3">
              <div className="flex gap-1" aria-hidden="true">
                <span className="size-1.5 rounded-full bg-[#e0dfd5]" />
                <span className="size-1.5 rounded-full bg-[#e0dfd5]" />
                <span className="size-1.5 rounded-full bg-[#e0dfd5]" />
              </div>
              <span className="flex flex-1 items-center justify-center gap-1.5 text-[9px] text-[#929688]">
                <Globe2 className="size-2.5" aria-hidden="true" />
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
                  className={`rounded p-1.5 ${!mobile ? 'bg-[#edf1e7] text-[#3c5633]' : 'text-[#9c9f94]'}`}
                >
                  <Monitor className="size-3" />
                </button>
                <button
                  type="button"
                  aria-label="Vista de móvil"
                  aria-pressed={mobile}
                  onClick={() => setMobile(true)}
                  className={`rounded p-1.5 ${mobile ? 'bg-[#edf1e7] text-[#3c5633]' : 'text-[#9c9f94]'}`}
                >
                  <Smartphone className="size-3" />
                </button>
              </div>
            </div>
            <div aria-live="polite" aria-atomic="true">
              <SitePreview
                example={example}
                mobile={mobile}
                priority={activeExample === 0}
              />
            </div>
          </div>
          <div className="hero-status">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#e7efdf] text-[#4d713c]">
              <CheckCheck className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold text-[#33432b]">
                Tu próximo gran paso, online.
              </p>
              <p className="mt-0.5 text-[10px] text-[#7d8575]">
                Diseño, contenido y SEO en un mismo lugar.
              </p>
            </div>
            <Sparkles
              className="ml-3 size-4 text-[#82976b]"
              aria-hidden="true"
            />
          </div>
          <div className="mt-5 flex items-center justify-center gap-2 text-[10px] tracking-wide text-[#8c9281]">
            <Sparkles className="size-3" aria-hidden="true" />
            Creada con IA. Personalizada para cada negocio.
          </div>
        </div>
      </div>
    </section>
  )
}
