'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, ChevronDown, ShieldCheck } from 'lucide-react'
import { content } from '@/lib/content'
import { trackFunnelEvent } from '@/lib/funnelEvents'

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section id="pricing" className="landing-section bg-[#fcfcf7]">
      <div className="landing-container">
        <div className="text-center">
          <p className="landing-eyebrow">
            Una inversión pequeña. Un gran comienzo.
          </p>
          <h2 className="landing-title">
            Un plan para cada
            <span className="landing-serif"> siguiente paso.</span>
          </h2>
          <p className="mt-4 text-sm text-[#7d8372]">
            Empieza con 14 días de prueba. Elige cómo crecer después.
          </p>
          <div
            className="mt-7 inline-flex items-center gap-1 rounded-full border border-[#dfe4d4] bg-[#edf0e5] p-1"
            role="group"
            aria-label="Modalidad de facturación"
          >
            <button
              type="button"
              aria-pressed={!isAnnual}
              onClick={() => setIsAnnual(false)}
              className={`min-h-9 rounded-full px-5 text-xs font-medium transition-colors ${!isAnnual ? 'bg-white text-[#34492c] shadow-sm' : 'text-[#7f8771]'}`}
            >
              Mensual
            </button>
            <button
              type="button"
              aria-pressed={isAnnual}
              onClick={() => setIsAnnual(true)}
              className={`flex min-h-9 items-center gap-2 rounded-full px-4 text-xs font-medium transition-colors ${isAnnual ? 'bg-white text-[#34492c] shadow-sm' : 'text-[#7f8771]'}`}
            >
              Anual
              <span className="rounded-full bg-[#dce8c9] px-2 py-0.5 text-[9px] font-semibold text-[#516b3e]">
                Hasta −22%
              </span>
            </button>
          </div>
        </div>
        <div className="mt-11 grid gap-5 md:grid-cols-3">
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
                className={`relative flex flex-col rounded-2xl border p-7 ${recommended ? 'border-[#819768] bg-[#f0f4e7] shadow-[0_8px_30px_#43572c08]' : 'border-[#e1e5d8] bg-white'}`}
              >
                {recommended ? (
                  <span className="absolute -top-3 left-6 rounded-full bg-[#4e6d3d] px-3 py-1 text-[9px] font-semibold tracking-wide text-white">
                    UN POCO MÁS DE IMPULSO
                  </span>
                ) : null}
                <h3 className="text-lg font-semibold text-[#34452c]">
                  {tier.name}
                </h3>
                <p className="mt-2 min-h-12 text-xs leading-6 text-[#7d8471]">
                  {tier.description}
                </p>
                <div className="mt-6" aria-live="polite">
                  <p className="flex items-baseline gap-1">
                    <span className="text-[42px] font-semibold tracking-[-.06em] text-[#2f4228]">
                      {isAnnual ? tier.priceYearly : tier.priceMonthly}
                    </span>
                    <span className="text-xs text-[#7e8672]">/mes</span>
                  </p>
                  <p className="mt-1 min-h-9 text-[10px] leading-5 text-[#8b917f]">
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
                  className={`mt-4 inline-flex min-h-11 items-center justify-center gap-3 rounded-lg border px-4 text-xs font-semibold transition-colors ${recommended ? 'border-[#29492e] bg-[#29492e] text-white hover:bg-[#3d6038]' : 'border-[#dbe1d0] bg-white text-[#4a633b] hover:bg-[#f1f4ea]'}`}
                >
                  Probar 14 días gratis
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
                <ul className="mt-7 flex-1 space-y-4 border-t border-[#dde4d2] pt-6">
                  {tier.features.map((feature) => (
                    <li
                      key={feature.title}
                      className="flex items-start gap-2.5"
                    >
                      <Check
                        className="mt-0.5 size-3.5 shrink-0 text-[#6b8d4c]"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-xs font-semibold text-[#495a3e]">
                          {feature.title}
                        </p>
                        <p className="mt-1 text-[11px] leading-5 text-[#868c7b]">
                          {feature.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                  {tier.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-xs text-[#69775a]"
                    >
                      <Check
                        className="size-3.5 text-[#6b8d4c]"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <details className="group mt-6 border-t border-[#dde4d2] pt-4">
                  <summary className="flex min-h-7 cursor-pointer list-none items-center justify-between rounded text-[11px] font-medium text-[#738363]">
                    Complementos opcionales
                    <ChevronDown
                      className="size-3.5 transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <ul className="mt-3 space-y-2 text-[11px] text-[#7d8771]">
                    {tier.addons.map((addon) => (
                      <li key={addon}>{addon}</li>
                    ))}
                  </ul>
                </details>
              </article>
            )
          })}
        </div>
        <p className="mt-7 flex items-center justify-center gap-2 text-[11px] text-[#858d77]">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Sin tarjeta para empezar · Sin permanencia
        </p>
      </div>
    </section>
  )
}
