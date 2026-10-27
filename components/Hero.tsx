'use client'

import Image from 'next/image'
import { ArrowRight, Search } from 'lucide-react'
import { trackFunnelEvent } from '@/lib/funnelEvents'
import { siteExamples } from '@/lib/siteExamples'

export default function Hero() {
  return (
    <section className="home-dark relative isolate flex min-h-[calc(100svh-72px)] items-end overflow-hidden bg-black text-white">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {siteExamples.map((example, index) => (
          <div
            key={example.slug}
            className={`home-hero-slide home-hero-slide-${index + 1}`}
          >
            <Image
              src={example.image}
              alt=""
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/25" />
      </div>

      <div className="home-container pt-32 pb-14 sm:pb-20 lg:pb-24">
        <h1 className="max-w-5xl text-[clamp(52px,8.6vw,132px)] leading-[0.92] font-medium tracking-[-0.055em]">
          Crea la web
          <br />
          de tu negocio.
        </h1>
        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-xl">
            <p className="text-lg leading-relaxed text-white/80 sm:text-xl">
              Locavo te ayuda a crear una página web para tu negocio local con
              inteligencia artificial. Reúne tus servicios, horarios y datos de
              contacto en un sitio que puedas actualizar. Revisa la propuesta,
              adapta los textos a lo que ofreces y facilita que tus clientes
              sepan dónde encontrarte y cómo contactar contigo.
            </p>
            <form
              action="/crear-pagina-web-negocio"
              method="get"
              className="mt-8 flex items-center gap-2 rounded-full bg-white p-1.5 text-black shadow-[0_20px_60px_-20px_#000]"
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
                className="ml-4 size-5 shrink-0 text-black/45"
                aria-hidden="true"
              />
              <input
                id="hero-business"
                name="q"
                type="search"
                maxLength={200}
                placeholder="Nombre de tu negocio"
                className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-black/45 focus-visible:outline-none"
              />
              <button type="submit" className="home-button shrink-0">
                Comenzar
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </form>
            <p className="mt-4 pl-2 text-sm text-white/70">
              Comienza gratis. No se requiere tarjeta de crédito.
            </p>
          </div>

          <div
            className="relative hidden h-12 min-w-64 text-right text-sm text-white/75 lg:block"
            aria-hidden="true"
          >
            {siteExamples.map((example, index) => (
              <p
                key={example.slug}
                className={`home-hero-caption-${index + 1} absolute right-0 bottom-0`}
              >
                <span className="font-medium text-white">{example.name}</span>
                <br />
                {example.category} · {example.location}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
