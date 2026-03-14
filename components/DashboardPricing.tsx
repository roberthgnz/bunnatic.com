'use client'

import { content } from '@/lib/content'
import { Check, CircleHelp, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { toast } from 'sonner'

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

const STRIPE_PRICES = {
  'tier-starter': {
    monthly:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY ||
      'price_starter_monthly',
    yearly:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY ||
      'price_starter_yearly',
  },
  'tier-pro': {
    monthly:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
    yearly:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly',
  },
  'tier-agency': {
    monthly:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY_MONTHLY ||
      'price_agency_monthly',
    yearly:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY_YEARLY ||
      'price_agency_yearly',
  },
  'tier-scale': {
    monthly:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_SCALE_MONTHLY ||
      'price_scale_monthly',
    yearly:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_SCALE_YEARLY || 'price_scale_yearly',
  },
}

export default function DashboardPricing({
  currentPlan = 'starter',
  currentPriceId = null,
  hasActiveSubscription = false,
  isTrialActive = false,
  trialEndsAt = null,
}: {
  currentPlan?: string
  currentPriceId?: string | null
  hasActiveSubscription?: boolean
  isTrialActive?: boolean
  trialEndsAt?: string | null
}) {
  const t = content
  const [isAnnual, setIsAnnual] = useState(false)
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null)

  const help = HELP_TEXT

  // Map plan to tier ID
  const planToTierId: Record<string, string> = {
    starter: 'tier-starter',
    pro: 'tier-pro',
    agency: 'tier-agency',
    scale: 'tier-scale',
  }

  const currentTierId = planToTierId[currentPlan] || 'tier-starter'

  // Calculate days remaining in trial
  const trialDaysRemaining = trialEndsAt
    ? Math.ceil(
      (new Date(trialEndsAt).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
    )
    : 0

  const getButtonText = (tierId: string, selectedIsAnnual: boolean) => {
    const selectedPriceId =
      STRIPE_PRICES[tierId as keyof typeof STRIPE_PRICES]?.[
      selectedIsAnnual ? 'yearly' : 'monthly'
      ]

    // Check if this is the exact current plan (same tier and frequency)
    if (selectedPriceId === currentPriceId) {
      return 'Plan actual'
    }

    // Check if it's the same tier but different frequency
    if (tierId === currentTierId && hasActiveSubscription) {
      return selectedIsAnnual ? 'Cambiar a anual' : 'Cambiar a mensual'
    }

    const tierOrder = ['tier-starter', 'tier-pro', 'tier-agency', 'tier-scale']
    const currentIndex = tierOrder.indexOf(currentTierId)
    const targetIndex = tierOrder.indexOf(tierId)

    // If user has active subscription
    if (hasActiveSubscription) {
      if (targetIndex > currentIndex) {
        return 'Mejorar plan'
      } else if (targetIndex < currentIndex) {
        return 'Cambiar a este plan'
      }
    }

    // User is on free tier (starter without subscription)
    if (!hasActiveSubscription && currentTierId === 'tier-starter') {
      // If trying to select starter plan while already on free tier
      if (tierId === 'tier-starter') {
        return 'Plan gratuito'
      }
      // If trial is active, show trial info
      if (isTrialActive) {
        return `Prueba gratis (${trialDaysRemaining} días)`
      }
      // Trial expired or no trial
      return 'Comenzar plan'
    }

    // Fallback
    return 'Seleccionar plan'
  }

  const isCurrentPlanAndFrequency = (tierId: string, selectedIsAnnual: boolean) => {
    const selectedPriceId =
      STRIPE_PRICES[tierId as keyof typeof STRIPE_PRICES]?.[
      selectedIsAnnual ? 'yearly' : 'monthly'
      ]
    return selectedPriceId === currentPriceId
  }

  const handleSubscribe = async (tierId: string) => {
    try {
      setLoadingPriceId(tierId)

      const priceId =
        STRIPE_PRICES[tierId as keyof typeof STRIPE_PRICES]?.[
        isAnnual ? 'yearly' : 'monthly'
        ]

      if (!priceId) {
        toast.error('Price not configured for this plan')
        return
      }

      // If user has active subscription, update it instead of creating new checkout
      if (hasActiveSubscription) {
        const response = await fetch('/api/stripe/update-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ priceId }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(errorText || 'Failed to update subscription')
        }

        toast.success('Suscripción actualizada correctamente')

        // Reload page to reflect changes
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        // Create new checkout session for first-time subscribers
        const response = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId,
            returnUrl: window.location.href,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to create checkout session')
        }

        const { url } = await response.json()
        if (url) {
          window.location.href = url
        } else {
          throw new Error('No checkout URL returned')
        }
      }
    } catch (error) {
      console.error(error)
      toast.error('Algo salió mal. Por favor, inténtalo de nuevo.')
    } finally {
      setLoadingPriceId(null)
    }
  }

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
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
            {t.pricing.title}
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:mt-4 sm:text-lg">
            {t.pricing.subtitle}
          </p>

          {/* Trial Banner */}
          {isTrialActive && trialDaysRemaining > 0 && (
            <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-4">
              <p className="text-sm font-semibold text-blue-900">
                🎉 Prueba gratuita activa: {trialDaysRemaining} día{trialDaysRemaining !== 1 ? 's' : ''} restante{trialDaysRemaining !== 1 ? 's' : ''}
              </p>
              <p className="mt-1 text-xs text-blue-700">
                Disfruta de todas las funciones sin costo hasta que expire tu prueba
              </p>
            </div>
          )}

          {!isTrialActive && trialEndsAt && !hasActiveSubscription && (
            <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4">
              <p className="text-sm font-semibold text-amber-900">
                ⚠️ Tu prueba gratuita ha expirado
              </p>
              <p className="mt-1 text-xs text-amber-700">
                Selecciona un plan para continuar disfrutando de todas las funciones
              </p>
            </div>
          )}

          <Button
            type="button"
            onClick={() => setIsAnnual((prev) => !prev)}
            variant="outline"
            className="mt-6 inline-flex h-auto w-full items-center justify-between gap-2 rounded-lg border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:mt-8 sm:h-10 sm:w-auto sm:justify-center sm:gap-3 sm:px-4 sm:py-0 sm:text-sm"
            aria-pressed={isAnnual}
          >
            <span
              className={`inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors ${isAnnual ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
            >
              <span
                className={`h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${isAnnual ? 'translate-x-5' : 'translate-x-0'
                  }`}
              />
            </span>
            <span className="text-right leading-tight sm:text-left sm:leading-none">
              {t.pricing.billingLabel},{' '}
              <span className="text-emerald-700">{t.pricing.saveLabel}</span>
            </span>
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {t.pricing.tiers.slice(0, 3).map((tier) => {
            const isStarter = tier.id === 'tier-starter'
            const isLoading = loadingPriceId === tier.id
            const isCurrent = isCurrentPlanAndFrequency(tier.id, isAnnual)

            return (
              <Card
                key={tier.id}
                className={`relative flex h-full flex-col overflow-hidden rounded-xl border ${isCurrent
                  ? 'border-emerald-200 bg-emerald-50/60 ring-2 ring-emerald-500'
                  : isStarter
                    ? 'border-emerald-100 bg-emerald-50/40'
                    : 'border-slate-200 bg-white'
                  }`}
              >
                {isCurrent && (
                  <div className="absolute right-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                    Activo
                  </div>
                )}
                <CardContent className="flex h-full flex-1 flex-col p-5 sm:p-8">
                  <div>
                    <h3
                      className={`text-2xl font-extrabold sm:text-3xl ${isStarter ? 'text-emerald-800' : 'text-slate-800'
                        }`}
                    >
                      {tier.name}
                    </h3>
                    <p className="mt-2 text-base text-slate-600 sm:mt-3 sm:text-lg">
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
                    <div className="mt-2 min-h-[24px] text-xs text-slate-500 sm:text-sm">
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

                  <div className="mt-6">
                    <Button
                      onClick={() => handleSubscribe(tier.id)}
                      disabled={isLoading || isCurrent || (tier.id === 'tier-starter' && !hasActiveSubscription)}
                      className={`h-10 w-full rounded-lg px-5 text-sm font-semibold ${isCurrent || (tier.id === 'tier-starter' && !hasActiveSubscription)
                        ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                        : isStarter
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        getButtonText(tier.id, isAnnual)
                      )}
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
                          <p className="text-lg font-extrabold text-slate-900 sm:text-xl">
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

                <CardFooter className="flex flex-col items-start gap-5 border-t border-slate-200 bg-slate-50/50 p-5 text-left sm:gap-6 sm:p-8">
                  <div className="w-full">
                    <h4 className="text-sm font-semibold text-slate-700 sm:text-base">
                      {t.pricing.addonsTitle}
                    </h4>
                    {renderInfoList(tier.addons, 'addons')}

                    <h4 className="mt-6 text-sm font-semibold text-slate-700 sm:mt-7 sm:text-base">
                      {t.pricing.includesTitle}
                    </h4>
                    {renderInfoList(tier.includes, 'includes')}
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
