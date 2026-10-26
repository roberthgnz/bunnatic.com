'use client'

import { content } from '@/lib/content'
import {
  AlertTriangle,
  Check,
  CircleHelp,
  Clock,
  CreditCard,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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

/** Plan highlighted as the recommended choice. */
const RECOMMENDED_TIER_ID = 'tier-pro'

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
  const currentTier = t.pricing.tiers.find((tier) => tier.id === currentTierId)

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

  const isCurrentPlanAndFrequency = (
    tierId: string,
    selectedIsAnnual: boolean
  ) => {
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
        toast.error('Este plan todavía no tiene un precio configurado.')
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
    inverted: boolean
  ) => (
    <ul className="mt-2.5 space-y-1.5">
      {items.map((item) => {
        const helper = help[type] as Record<string, string>

        return (
          <li
            key={item}
            className={cn(
              'flex items-center gap-2 text-sm',
              inverted ? 'text-primary-foreground/80' : 'text-muted-foreground'
            )}
          >
            <span className="min-w-0 flex-1">{item}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className={cn(
                    'rounded-full',
                    inverted
                      ? 'text-primary-foreground/50 hover:text-primary-foreground hover:bg-white/10'
                      : 'text-muted-foreground/60 hover:text-foreground'
                  )}
                  aria-label={`Más información: ${item}`}
                >
                  <CircleHelp aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8} className="max-w-64">
                {helper[item] ?? help.fallback}
              </TooltipContent>
            </Tooltip>
          </li>
        )
      })}
    </ul>
  )

  // Current subscription status summary
  const trialRunning = isTrialActive && trialDaysRemaining > 0
  const trialExpired = !isTrialActive && !!trialEndsAt && !hasActiveSubscription
  const daysLabel = `${trialDaysRemaining} ${trialDaysRemaining === 1 ? 'día' : 'días'}`

  const status = hasActiveSubscription
    ? {
        icon: CreditCard,
        title: `Plan ${currentTier?.name ?? ''}`.trim(),
        description:
          'Tu suscripción está activa. Puedes cambiar de plan o de periodo de facturación cuando quieras.',
        badge: (
          <Badge variant="success">
            <Check aria-hidden="true" />
            Activa
          </Badge>
        ),
        tone: 'default' as const,
      }
    : trialRunning
      ? {
          icon: Clock,
          title: 'Prueba gratuita activa',
          description: `Te ${trialDaysRemaining === 1 ? 'queda' : 'quedan'} ${daysLabel} para disfrutar de todas las funciones sin coste. Elige un plan para no perder el acceso.`,
          badge: (
            <Badge variant="secondary" className="tabular-nums">
              {daysLabel}
            </Badge>
          ),
          tone: 'default' as const,
        }
      : trialExpired
        ? {
            icon: AlertTriangle,
            title: 'Tu prueba gratuita ha terminado',
            description:
              'Selecciona un plan para seguir disfrutando de todas las funciones.',
            badge: <Badge variant="warning">Prueba finalizada</Badge>,
            tone: 'warning' as const,
          }
        : {
            icon: Sparkles,
            title: 'Aún no tienes un plan de pago',
            description:
              'Elige el plan que mejor encaje con tu negocio. Puedes cambiarlo cuando quieras.',
            badge: <Badge variant="outline">Sin suscripción</Badge>,
            tone: 'default' as const,
          }

  const StatusIcon = status.icon
  const annualSaving =
    t.pricing.saveLabel.match(/\d+\s?%/)?.[0] ?? t.pricing.saveLabel

  return (
    <div className="space-y-8">
      <section
        aria-label="Estado de tu suscripción"
        className={cn(
          'bg-card ring-border flex flex-col gap-4 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 sm:flex-row sm:items-center',
          status.tone === 'warning' && 'bg-warning/5 ring-warning/30'
        )}
      >
        <span
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-lg',
            status.tone === 'warning'
              ? 'bg-warning/10 text-warning'
              : 'bg-secondary text-secondary-foreground'
          )}
        >
          <StatusIcon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-foreground text-base font-semibold tracking-[-0.01em]">
              {status.title}
            </p>
            {status.badge}
          </div>
          <p className="text-muted-foreground mt-1 text-sm leading-6 text-pretty">
            {status.description}
          </p>
        </div>
      </section>

      <section aria-labelledby="plans-title" className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="plans-title"
              className="text-foreground text-lg font-semibold tracking-[-0.02em]"
            >
              Elige tu plan
            </h2>
            <p className="text-muted-foreground text-sm">
              {t.pricing.subtitle}
            </p>
          </div>

          <div
            role="group"
            aria-label="Periodo de facturación"
            className="bg-muted ring-border inline-flex w-full items-center rounded-lg p-1 ring-1 sm:w-auto"
          >
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              aria-pressed={!isAnnual}
              className={cn(
                'focus-visible:ring-ring/50 h-8 flex-1 rounded-md px-3.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 sm:flex-none',
                !isAnnual
                  ? 'bg-card text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              aria-pressed={isAnnual}
              className={cn(
                'focus-visible:ring-ring/50 inline-flex h-8 flex-1 items-center justify-center gap-2 rounded-md px-3.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 sm:flex-none',
                isAnnual
                  ? 'bg-card text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Anual
              <span className="bg-success/10 text-success rounded-full px-1.5 py-0.5 text-[11px] font-semibold">
                <span aria-hidden="true">−{annualSaving}</span>
                <span className="sr-only">({t.pricing.saveLabel})</span>
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
          {t.pricing.tiers.slice(0, 3).map((tier) => {
            const isLoading = loadingPriceId === tier.id
            const isCurrent = isCurrentPlanAndFrequency(tier.id, isAnnual)
            const isCurrentTier =
              isCurrent || (tier.id === currentTierId && hasActiveSubscription)
            const isRecommended = tier.id === RECOMMENDED_TIER_ID
            const isDisabled =
              isLoading ||
              isCurrent ||
              (tier.id === 'tier-starter' && !hasActiveSubscription)
            const inverted = isRecommended
            const titleId = `plan-${tier.id}-title`

            return (
              <article
                key={tier.id}
                aria-labelledby={titleId}
                className={cn(
                  'relative flex h-full flex-col overflow-hidden rounded-xl ring-1',
                  inverted
                    ? 'bg-primary text-primary-foreground ring-primary shadow-[0_18px_40px_-24px_rgba(0,0,0,0.8)]'
                    : 'bg-card text-card-foreground ring-border shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
                  isCurrentTier &&
                    'ring-primary ring-offset-background ring-2 ring-offset-2'
                )}
              >
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex min-h-6 items-center justify-between gap-2">
                    <h3
                      id={titleId}
                      className="text-lg font-semibold tracking-[-0.02em]"
                    >
                      {tier.name}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      {isRecommended && !isCurrentTier ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-black">
                          <Sparkles className="size-3" aria-hidden="true" />
                          Recomendado
                        </span>
                      ) : null}
                      {isCurrentTier ? (
                        <Badge
                          className={cn(
                            inverted && 'bg-primary-foreground text-primary'
                          )}
                        >
                          <Check aria-hidden="true" />
                          Plan actual
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                  <p
                    className={cn(
                      'mt-1.5 min-h-10 text-sm leading-5 text-pretty',
                      inverted
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    )}
                  >
                    {tier.description}
                  </p>

                  <div className="mt-6">
                    <p className="flex items-baseline gap-1">
                      <span className="text-[44px] leading-none font-semibold tracking-[-0.04em] tabular-nums">
                        {isAnnual ? tier.priceYearly : tier.priceMonthly}
                      </span>
                      <span
                        className={cn(
                          'text-sm font-medium',
                          inverted
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        )}
                      >
                        {tier.period}
                      </span>
                    </p>
                    <p
                      className={cn(
                        'mt-2 min-h-5 text-xs tabular-nums',
                        inverted
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      )}
                    >
                      {isAnnual ? (
                        <>
                          <span className="sr-only">
                            {t.pricing.previousPriceLabel}:{' '}
                          </span>
                          <span className="line-through">
                            {tier.priceMonthly}
                            {tier.period}
                          </span>
                          {' · '}
                          {t.pricing.billedAnnuallyLabel}{' '}
                          <span
                            className={cn(
                              'font-semibold',
                              inverted
                                ? 'text-primary-foreground'
                                : 'text-foreground'
                            )}
                          >
                            {tier.annualTotal}
                          </span>
                        </>
                      ) : (
                        'Facturación mensual'
                      )}
                    </p>
                  </div>

                  <Button
                    type="button"
                    size="lg"
                    onClick={() => handleSubscribe(tier.id)}
                    disabled={isDisabled}
                    aria-busy={isLoading || undefined}
                    variant={
                      inverted
                        ? 'secondary'
                        : isCurrentTier || isDisabled
                          ? 'outline'
                          : 'default'
                    }
                    className={cn(
                      'mt-6 w-full',
                      inverted &&
                        'bg-primary-foreground text-primary hover:bg-primary-foreground/90'
                    )}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" aria-hidden="true" />
                        Procesando…
                      </>
                    ) : (
                      getButtonText(tier.id, isAnnual)
                    )}
                  </Button>

                  <ul className="mt-6 space-y-3.5">
                    {tier.features.map((feature) => (
                      <li
                        key={feature.title}
                        className="flex items-start gap-3"
                      >
                        <span
                          className={cn(
                            'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full',
                            inverted
                              ? 'bg-white/10 text-white'
                              : 'bg-secondary text-primary'
                          )}
                        >
                          <Check className="size-3.5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{feature.title}</p>
                          <p
                            className={cn(
                              'text-sm leading-5',
                              inverted
                                ? 'text-primary-foreground/70'
                                : 'text-muted-foreground'
                            )}
                          >
                            {feature.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={cn(
                    'grid gap-5 border-t px-6 py-5',
                    inverted
                      ? 'border-white/10 bg-white/5'
                      : 'border-border bg-muted/40'
                  )}
                >
                  <div>
                    <h4
                      className={cn(
                        'text-xs font-medium',
                        inverted
                          ? 'text-primary-foreground/60'
                          : 'text-muted-foreground'
                      )}
                    >
                      {t.pricing.addonsTitle}
                    </h4>
                    {renderInfoList(tier.addons, 'addons', inverted)}
                  </div>
                  <div>
                    <h4
                      className={cn(
                        'text-xs font-medium',
                        inverted
                          ? 'text-primary-foreground/60'
                          : 'text-muted-foreground'
                      )}
                    >
                      {t.pricing.includesTitle}
                    </h4>
                    {renderInfoList(tier.includes, 'includes', inverted)}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
