'use client'

import { Check } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

export const ONBOARDING_STEPS = [
  { id: 'checkout', label: 'Tu plan' },
  { id: 'business', label: 'Tu negocio' },
] as const

/** Reads `?step=` (same rule as the onboarding page) and renders the indicator. */
export function OnboardingSteps() {
  const searchParams = useSearchParams()
  const current = searchParams.get('step') === 'business' ? 1 : 0
  return <StepIndicator current={current} />
}

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol aria-label="Progreso de la configuración" className="flex items-center">
      {ONBOARDING_STEPS.map((step, index) => {
        const completed = index < current
        const active = index === current

        return (
          <li
            key={step.id}
            aria-current={active ? 'step' : undefined}
            className="flex items-center"
          >
            {index > 0 ? (
              <span
                aria-hidden="true"
                className={cn(
                  'mx-2 h-px w-6 sm:mx-3 sm:w-10',
                  completed || active ? 'bg-primary/60' : 'bg-border'
                )}
              />
            ) : null}
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition-colors',
                  completed && 'bg-primary text-primary-foreground',
                  active &&
                    'bg-primary text-primary-foreground ring-primary/15 ring-4',
                  !completed &&
                    !active &&
                    'border-border bg-card text-muted-foreground border'
                )}
              >
                {completed ? (
                  <Check className="size-3.5" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn(
                  'text-sm',
                  active
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground sr-only sm:not-sr-only'
                )}
              >
                {step.label}
                {completed ? (
                  <span className="sr-only"> (completado)</span>
                ) : null}
              </span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
