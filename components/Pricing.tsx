'use client'

import { content } from '@/lib/content'
import { Check, ChevronDown, CircleHelp } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

const HELP_TEXT = {
  addons: {
    'Sección extra 3€/mes':
      'Añade una sección adicional a tu web actual, ideal para servicios nuevos o promociones.',
    'Usuario extra 4€/mes':
      'Invita a otra persona de tu equipo para editar contenido con su propio acceso.',
    'Web extra 5€/mes':
      'Crea una web adicional para otra sede, marca o línea de negocio.',
    'Web extra 4€/mes':
      'Precio reducido por web adicional cuando ya estás en un plan de mayor capacidad.',
  },
  includes: {
    'Dominio incluido':
      'Incluye conexión y configuración básica de dominio para publicar sin pasos técnicos.',
    'SSL seguro':
      'Tu web se publica con HTTPS para proteger datos y mejorar la confianza de clientes.',
    'Analítica básica':
      'Métricas esenciales de visitas y páginas más vistas para medir resultados.',
    'Todo Esencial': 'Incluye todas las funciones del plan Esencial.',
    'SEO local':
      'Optimización para aparecer mejor en búsquedas de tu zona y en Google Maps.',
    'Soporte prioritario':
      'Atención más rápida para incidencias o dudas de configuración.',
    'Todo Impulso': 'Incluye todas las funciones del plan Impulso.',
    'Reportes personalizados':
      'Informes adaptados a tu negocio con los indicadores que más te importan.',
    'Calendario compartido':
      'Organiza cambios y publicaciones con visibilidad para todo el equipo.',
    'Todo Equipo': 'Incluye todas las funciones del plan Equipo.',
    'Analítica avanzada':
      'Panel con mayor detalle para entender conversión, rendimiento y evolución.',
    'Soporte dedicado':
      'Canal de soporte más cercano para acompañamiento continuo.',
  },
  fallback: 'Información adicional de esta funcionalidad.',
} as const

export default function Pricing() {
  const t = content
  const [isAnnual, setIsAnnual] = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const signupBase = '/signup'
  const help = HELP_TEXT

  const renderInfoList = (
    items: string[],
    type: 'addons' | 'includes',
    classNames = 'mt-3 w-full space-y-2'
  ) => (
    <ul className={classNames}>
      {items.map((item) => {
        const helper = help[type] as Record<string, string>

        return (
          <li
            key={item}
            className="flex items-center text-sm text-slate-600 sm:text-base"
          >
            <span>{item}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="ml-auto h-5 w-5 rounded-full text-slate-300 hover:text-slate-500"
                  aria-label={item}
                >
                  <CircleHelp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8}>
                {helper[item] ?? help.fallback}
              </TooltipContent>
            </Tooltip>
          </li>
        )
      })}
    </ul>
  )

  return (
    <section id="pricing" className="bg-[#f4f7fc] py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-5xl">
            {t.pricing.title}
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:mt-4 sm:text-xl">
            {t.pricing.subtitle}
          </p>

          <Button
            type="button"
            onClick={() => setIsAnnual((prev) => !prev)}
            variant="outline"
            className="mt-6 inline-flex h-auto w-full items-center justify-between gap-2 rounded-2xl border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:mt-8 sm:h-10 sm:w-auto sm:justify-center sm:gap-3 sm:rounded-full sm:px-4 sm:py-0 sm:text-sm"
            aria-pressed={isAnnual}
          >
            <span
              className={`inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors ${
                isAnnual ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  isAnnual ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </span>
            <span className="text-right leading-tight sm:text-left sm:leading-none">
              {t.pricing.billingLabel},{' '}
              <span className="text-indigo-600">{t.pricing.saveLabel}</span>
            </span>
          </Button>
        </div>

        <Card className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white p-0 sm:mt-14">
          <div className="grid grid-cols-1 divide-y divide-slate-200 xl:grid-cols-3 xl:divide-x xl:divide-y-0">
            {t.pricing.tiers.slice(0, 3).map((tier) => {
              const isStarter = tier.id === 'tier-starter'

              return (
                <article
                  key={tier.id}
                  className={`relative flex h-full flex-col ${
                    isStarter ? 'bg-emerald-50/40' : ''
                  }`}
                >
                  <CardContent className="flex h-full flex-1 flex-col p-5 sm:p-8">
                    <div>
                      <h3
                        className={`text-2xl font-extrabold sm:text-3xl ${
                          isStarter ? 'text-emerald-800' : 'text-slate-800'
                        }`}
                      >
                        {tier.name}
                      </h3>
                      <p className="mt-2 max-w-xs text-base text-slate-600 sm:mt-3 sm:text-lg">
                        {tier.description}
                      </p>
                    </div>

                    <div className="mt-7 sm:mt-8">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl">
                          {isAnnual ? tier.priceYearly : tier.priceMonthly}
                        </span>
                        <span className="text-xl font-semibold text-slate-500 sm:text-2xl">
                          {tier.period}
                        </span>
                      </div>
                      <div className="mt-2 min-h-[44px] text-xs text-slate-500 sm:text-sm">
                        {isAnnual ? (
                          <div className="space-y-1">
                            <p>
                              {t.pricing.previousPriceLabel}:{' '}
                              <span className="line-through">
                                {tier.priceMonthly}
                                {tier.period}
                              </span>
                            </p>
                            <p>
                              {t.pricing.billedAnnuallyLabel}:{' '}
                              <span className="font-semibold text-slate-700">
                                {tier.annualTotal}
                              </span>
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Button
                        asChild
                        className={`h-10 w-full rounded-full px-5 text-sm font-semibold sm:w-auto ${
                          isStarter
                            ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        <Link
                          href={`${signupBase}?redirect=/checkout&source=pricing&plan=${tier.id.replace('tier-', '')}`}
                        >
                          {tier.cta}
                        </Link>
                      </Button>
                    </div>

                    <ul className="mt-8 space-y-4 sm:mt-10 sm:space-y-5">
                      {tier.features.map((feature) => (
                        <li
                          key={feature.title}
                          className="flex items-start gap-3"
                        >
                          <Check className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                          <div className="space-y-1">
                            <p className="text-lg font-extrabold text-slate-900 sm:text-2xl">
                              {feature.title}
                            </p>
                            <p className="text-sm text-slate-500 sm:text-base">
                              {feature.detail}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="flex flex-col items-start gap-5 rounded-none border-t border-slate-200 bg-slate-50 p-5 text-left sm:gap-6 sm:p-8">
                    <div className="hidden w-full sm:block">
                      <h4 className="text-sm font-semibold text-slate-700 sm:text-base">
                        {t.pricing.addonsTitle}
                      </h4>
                      {renderInfoList(tier.addons, 'addons')}

                      <h4 className="mt-6 text-sm font-semibold text-slate-700 sm:mt-7 sm:text-base">
                        {t.pricing.includesTitle}
                      </h4>
                      {renderInfoList(tier.includes, 'includes')}
                    </div>

                    <div className="w-full space-y-3 sm:hidden">
                      <Collapsible
                        open={Boolean(openSections[`${tier.id}-addons`])}
                        onOpenChange={(open) =>
                          setOpenSections((prev) => ({
                            ...prev,
                            [`${tier.id}-addons`]: open,
                          }))
                        }
                      >
                        <CollapsibleTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            <span>{t.pricing.addonsTitle}</span>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                openSections[`${tier.id}-addons`]
                                  ? 'rotate-180'
                                  : ''
                              }`}
                            />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          {renderInfoList(
                            tier.addons,
                            'addons',
                            'mt-2 w-full space-y-2'
                          )}
                        </CollapsibleContent>
                      </Collapsible>

                      <Collapsible
                        open={Boolean(openSections[`${tier.id}-includes`])}
                        onOpenChange={(open) =>
                          setOpenSections((prev) => ({
                            ...prev,
                            [`${tier.id}-includes`]: open,
                          }))
                        }
                      >
                        <CollapsibleTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            <span>{t.pricing.includesTitle}</span>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                openSections[`${tier.id}-includes`]
                                  ? 'rotate-180'
                                  : ''
                              }`}
                            />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          {renderInfoList(
                            tier.includes,
                            'includes',
                            'mt-2 w-full space-y-2'
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </CardFooter>
                </article>
              )
            })}
          </div>
        </Card>
      </div>
    </section>
  )
}
