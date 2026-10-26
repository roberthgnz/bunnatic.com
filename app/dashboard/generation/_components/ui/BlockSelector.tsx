import { Briefcase, Check, Clock, User } from 'lucide-react'
import type {
  SourceBlock,
  BusinessSourcePreview,
} from '@/lib/businessSourceGeneration'
import { cn } from '@/lib/utils'
import { isBlockDisabled } from '../utils'

type Props = {
  preview: BusinessSourcePreview
  selectedBlocks: Set<SourceBlock>
  onToggleBlock: (block: SourceBlock) => void
  labels: {
    blocksTitle: string
    blockProfile: string
    blockProfileDesc: string
    blockServices: string
    blockServicesDesc: string
    blockHours: string
    blockHoursDesc: string
    blockUnavailable?: string
  }
}

const blockDefs = [
  {
    key: 'profile' as const,
    icon: User,
    labelKey: 'blockProfile' as const,
    descKey: 'blockProfileDesc' as const,
  },
  {
    key: 'services' as const,
    icon: Briefcase,
    labelKey: 'blockServices' as const,
    descKey: 'blockServicesDesc' as const,
  },
  {
    key: 'hours' as const,
    icon: Clock,
    labelKey: 'blockHours' as const,
    descKey: 'blockHoursDesc' as const,
  },
]

export function BlockSelector({
  preview,
  selectedBlocks,
  onToggleBlock,
  labels,
}: Props) {
  return (
    <fieldset>
      <legend className="text-foreground mb-3 text-sm font-medium">
        {labels.blocksTitle}
      </legend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {blockDefs.map(({ key, icon: Icon, labelKey, descKey }) => {
          const disabled = isBlockDisabled(key, preview)
          const isSelected = selectedBlocks.has(key) && !disabled
          return (
            <label
              key={key}
              className={cn(
                'relative flex items-start gap-3 rounded-xl p-4 transition-[background-color,box-shadow]',
                'has-focus-visible:outline-ring has-focus-visible:outline-2 has-focus-visible:outline-offset-2',
                disabled
                  ? 'bg-muted/50 ring-border cursor-not-allowed ring-1'
                  : isSelected
                    ? 'bg-accent/40 ring-primary cursor-pointer ring-2'
                    : 'bg-card ring-border hover:bg-muted/50 cursor-pointer shadow-[0_1px_2px_rgba(31,42,28,0.04)] ring-1'
              )}
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={disabled}
                onChange={() => onToggleBlock(key)}
                className="sr-only"
              />
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-lg',
                  disabled
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-secondary text-secondary-foreground'
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    'block text-sm font-semibold',
                    disabled ? 'text-muted-foreground' : 'text-foreground'
                  )}
                >
                  {labels[labelKey]}
                </span>
                <span className="text-muted-foreground mt-0.5 block text-xs leading-5">
                  {disabled && labels.blockUnavailable
                    ? labels.blockUnavailable
                    : labels[descKey]}
                </span>
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md ring-1 transition-colors',
                  isSelected
                    ? 'bg-primary text-primary-foreground ring-primary'
                    : 'bg-card ring-input text-transparent',
                  disabled && 'opacity-50'
                )}
              >
                <Check className="size-3.5" />
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
