'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, ChevronDown } from 'lucide-react'
import { content } from '@/lib/content'
import { trackFunnelEvent } from '@/lib/funnelEvents'

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section id="pricing" className="home-section">
      <div className="home-container">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="home-eyebrow">
              Una inversión pequeña. Un gran comienzo.
            </p>
            <h2 className="home-title">Un plan para cada siguiente paso.</h2>
            <p className="mt-6 text-lg text-(--home-muted)">
              Empieza con 14 días de prueba. Elige cómo crecer después.
            </p>
          </div>
          <div
            className="inline-flex w-fit shrink-0 items-center gap-1 rounded-full bg-(--home-soft) p-1"
            role="group"
            aria-label="Modalidad de facturación"
          >
            <button
              type="button"
              aria-pressed={!isAnnual}
              onClick={() => setIsAnnual(false)}
              className={`min-h-10 rounded-full px-5 text-sm font-medium transition-colors ${!isAnnual ? 'bg-black text-white' : 'text-black/60 hover:text-black'}`}
            >
              Mensual
            </button>
            <button
              type="button"
              aria-pressed={isAnnual}
              onClick={() => setIsAnnual(true)}
              className={`flex min-h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors ${isAnnual ? 'bg-black text-white' : 'text-black/60 hover:text-black'}`}
            >
              Anual
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${isAnnual ? 'bg-white/15' : 'bg-black/[0.07]'}`}
              >
                Hasta −22%
              </span>
            </button>
          </div>
        </div>
        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {content.pricing.tiers.slice(0, 3).map((tier, index) => {
            const recommended = index === 1
            const params = new URLSearchParams({
              redirect: '/checkout',
              source: 'pricing',
              plan: tier.id.replace('tier-', ''),
              billing: isAnnual ? 'yearly' : 'monthly',
            })
            return (
              <article
                key={tier.id}
                className={`relative flex flex-col rounded-3xl p-8 sm:p-10 ${recommended ? 'home-dark bg-[#0b0b0b] text-white' : 'border border-(--home-line)'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-2xl font-medium tracking-[-0.03em]">
                    {tier.name}
                  </h3>
                  {recommended ? (
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-black">
                      Recomendado
                    </span>
                  ) : null}
                </div>
                <p
                  className={`mt-3 min-h-12 text-sm leading-6 ${recommended ? 'text-white/60' : 'text-(--home-muted)'}`}
                >
                  {tier.description}
                </p>
                <div className="mt-8" aria-live="polite">
                  <p className="flex items-baseline gap-1.5">
                    <span className="text-6xl font-medium tracking-[-0.06em]">
                      {isAnnual ? tier.priceYearly : tier.priceMonthly}
                    </span>
                    <span
                      className={`text-sm ${recommended ? 'text-white/60' : 'text-(--home-muted)'}`}
                    >
                      /mes
                    </span>
                  </p>
                  <p
                    className={`mt-2 min-h-10 text-xs leading-5 ${recommended ? 'text-white/50' : 'text-(--home-muted)'}`}
                  >
                    {isAnnual
                      ? `${tier.annualTotal}, facturados anualmente tras la prueba.`
                      : 'Facturación mensual tras la prueba.'}
                  </p>
                </div>
                <Link
                  href={`/signup?${params.toString()}`}
                  onClick={() =>
                    trackFunnelEvent('landing_cta_click', {
                      placement: 'pricing',
                      plan: tier.id.replace('tier-', ''),
                      billing: isAnnual ? 'yearly' : 'monthly',
                    })
                  }
                  className={`home-button mt-6 w-full ${recommended ? 'home-button-light' : ''}`}
                >
                  Probar 14 días gratis
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <ul
                  className={`mt-8 flex-1 space-y-4 border-t pt-8 ${recommended ? 'border-white/15' : 'border-(--home-line)'}`}
                >
                  {tier.features.map((feature) => (
                    <li key={feature.title} className="flex items-start gap-3">
                      <Check
                        className="mt-0.5 size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-medium">{feature.title}</p>
                        <p
                          className={`mt-1 text-sm leading-6 ${recommended ? 'text-white/55' : 'text-(--home-muted)'}`}
                        >
                          {feature.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <Check className="size-4 shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <details
                  className={`group mt-8 border-t pt-5 ${recommended ? 'border-white/15' : 'border-(--home-line)'}`}
                >
                  <summary className="flex min-h-7 cursor-pointer list-none items-center justify-between rounded text-sm font-medium">
                    Complementos opcionales
                    <ChevronDown
                      className="size-4 transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <ul
                    className={`mt-3 space-y-2 text-sm ${recommended ? 'text-white/60' : 'text-(--home-muted)'}`}
                  >
                    {tier.addons.map((addon) => (
                      <li key={addon}>{addon}</li>
                    ))}
                  </ul>
                </details>
              </article>
            )
          })}
        </div>
        <p className="mt-10 text-center text-sm text-(--home-muted)">
          Sin tarjeta para empezar · Sin permanencia
        </p>
      </div>
    </section>
  )
}
