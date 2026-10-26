import { Check, Plus } from 'lucide-react'
import { BusinessMonogram } from '@/components/dashboard/page-header'
import { cn } from '@/lib/utils'
import type { BusinessListItem } from '../types'

type Props = {
  businesses: BusinessListItem[]
  selectedBusinessId: string
  onSelectBusiness: (id: string) => void
  labels: {
    targetBusinessLabel: string
    selectTargetPlaceholder: string
    createNewBusiness: string
    targetBusinessHint?: string
    createNewBusinessDesc?: string
  }
}

function ChoiceIndicator({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-5 shrink-0 items-center justify-center rounded-full ring-1 transition-colors',
        selected
          ? 'bg-primary text-primary-foreground ring-primary'
          : 'bg-card ring-input text-transparent'
      )}
    >
      <Check className="size-3" />
    </span>
  )
}

const choiceClasses = (selected: boolean) =>
  cn(
    'flex cursor-pointer items-center gap-3 rounded-xl p-3.5 transition-[background-color,box-shadow]',
    'has-focus-visible:outline-ring has-focus-visible:outline-2 has-focus-visible:outline-offset-2',
    selected
      ? 'bg-accent/40 ring-primary ring-2'
      : 'bg-card ring-border hover:bg-muted/50 shadow-[0_1px_2px_rgba(31,42,28,0.04)] ring-1'
  )

export function BusinessSelector({
  businesses,
  selectedBusinessId,
  onSelectBusiness,
  labels,
}: Props) {
  const isNew = selectedBusinessId === 'new'

  return (
    <fieldset>
      <legend className="text-foreground text-sm font-medium">
        {labels.targetBusinessLabel}
      </legend>
      {labels.targetBusinessHint ? (
        <p className="text-muted-foreground mt-1 text-xs">
          {labels.targetBusinessHint}
        </p>
      ) : null}

      <div className="-m-1 mt-2 max-h-[22rem] overflow-y-auto p-1">
        <div className="grid gap-2.5 sm:grid-cols-2">
          {businesses.map((business) => {
            const selected = selectedBusinessId === business.id
            return (
              <label key={business.id} className={choiceClasses(selected)}>
                <input
                  type="radio"
                  name="generation-target-business"
                  value={business.id}
                  checked={selected}
                  onChange={() => onSelectBusiness(business.id)}
                  className="sr-only"
                />
                <BusinessMonogram name={business.name} className="size-9" />
                <span className="min-w-0 flex-1">
                  <span className="text-foreground block truncate text-sm font-semibold">
                    {business.name || labels.selectTargetPlaceholder}
                  </span>
                  <span className="text-muted-foreground block truncate text-xs">
                    /{business.slug}
                  </span>
                </span>
                <ChoiceIndicator selected={selected} />
              </label>
            )
          })}

          <label className={choiceClasses(isNew)}>
            <input
              type="radio"
              name="generation-target-business"
              value="new"
              checked={isNew}
              onChange={() => onSelectBusiness('new')}
              className="sr-only"
            />
            <span
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-lg border border-dashed',
                isNew
                  ? 'border-primary/40 text-primary'
                  : 'border-input text-muted-foreground'
              )}
            >
              <Plus className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="text-foreground block truncate text-sm font-semibold">
                {labels.createNewBusiness}
              </span>
              {labels.createNewBusinessDesc ? (
                <span className="text-muted-foreground block truncate text-xs">
                  {labels.createNewBusinessDesc}
                </span>
              ) : null}
            </span>
            <ChoiceIndicator selected={isNew} />
          </label>
        </div>
      </div>
    </fieldset>
  )
}
