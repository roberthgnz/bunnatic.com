import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export const CREATE_STEPS = [
  { id: 'search', label: 'Tu negocio' },
  { id: 'analyzing', label: 'Análisis' },
  { id: 'preview', label: 'Tu propuesta' },
] as const

type CreateStepperProps = {
  /** Zero-based index of the active stage. */
  current: number
}

/** Visible progress through the public creation funnel. */
export default function CreateStepper({ current }: CreateStepperProps) {
  return (
    <ol
      aria-label="Progreso de la creación de tu web"
      className="flex items-center justify-center"
    >
      {CREATE_STEPS.map((step, index) => {
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
                  'mx-2 h-px w-6 sm:mx-3 sm:w-12',
                  completed || active ? 'bg-[#6f8a5a]' : 'bg-[#dde1d3]'
                )}
              />
            ) : null}
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums transition-colors',
                  completed && 'bg-[#29492e] text-white',
                  active && 'bg-[#29492e] text-white ring-4 ring-[#29492e]/12',
                  !completed &&
                    !active &&
                    'border border-[#dde1d3] bg-white text-[#8a9180]'
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
                  'text-xs sm:text-[13px]',
                  active
                    ? 'font-medium text-[#2b3b26]'
                    : 'sr-only text-[#7b8271] sm:not-sr-only'
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
