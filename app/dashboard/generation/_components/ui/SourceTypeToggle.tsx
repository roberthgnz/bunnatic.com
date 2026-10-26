import { Check, Globe, MapPin, type LucideIcon } from 'lucide-react'
import type { SourceType } from '@/lib/businessSourceGeneration'
import { cn } from '@/lib/utils'

type Props = {
  sourceType: SourceType
  onSourceChange: (source: SourceType) => void
  labels: {
    sourceLabel: string
    sourceGoogle: string
    sourceUrl: string
    sourceGoogleDesc?: string
    sourceUrlDesc?: string
  }
}

export function SourceTypeToggle({
  sourceType,
  onSourceChange,
  labels,
}: Props) {
  const options: Array<{
    value: SourceType
    icon: LucideIcon
    label: string
    description?: string
  }> = [
    {
      value: 'google',
      icon: MapPin,
      label: labels.sourceGoogle,
      description: labels.sourceGoogleDesc,
    },
    {
      value: 'url',
      icon: Globe,
      label: labels.sourceUrl,
      description: labels.sourceUrlDesc,
    },
  ]

  return (
    <fieldset>
      <legend className="text-foreground mb-3 text-sm font-medium">
        {labels.sourceLabel}
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map(({ value, icon: Icon, label, description }) => {
          const isSelected = sourceType === value
          return (
            <label
              key={value}
              className={cn(
                'relative flex cursor-pointer items-start gap-3 rounded-xl p-4 transition-[background-color,box-shadow]',
                'has-focus-visible:outline-ring has-focus-visible:outline-2 has-focus-visible:outline-offset-2',
                isSelected
                  ? 'bg-accent/40 ring-primary ring-2'
                  : 'bg-card ring-border hover:bg-muted/50 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1'
              )}
            >
              <input
                type="radio"
                name="generation-source"
                value={value}
                checked={isSelected}
                onChange={() => onSourceChange(value)}
                className="sr-only"
              />
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-lg',
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-foreground block text-sm font-semibold">
                  {label}
                </span>
                {description ? (
                  <span className="text-muted-foreground mt-0.5 block text-xs leading-5">
                    {description}
                  </span>
                ) : null}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ring-1 transition-colors',
                  isSelected
                    ? 'bg-primary text-primary-foreground ring-primary'
                    : 'bg-card ring-border text-transparent'
                )}
              >
                <Check className="size-3" />
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
