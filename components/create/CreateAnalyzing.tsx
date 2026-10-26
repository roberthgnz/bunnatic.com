import { forwardRef } from 'react'
import { Check, Globe2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type AnalysisStep = {
  label: string
  /** Progress (0-100) at which this step counts as finished. */
  doneAt: number
}

type CreateAnalyzingProps = {
  progress: number
  inputMode: 'google' | 'url'
  steps: AnalysisStep[]
  title: string
  subtitle: string
  /** Shown in the skeleton once the business data has arrived. */
  businessName?: string | null
}

const CreateAnalyzing = forwardRef<HTMLHeadingElement, CreateAnalyzingProps>(
  function CreateAnalyzing(
    { progress, inputMode, steps, title, subtitle, businessName },
    headingRef
  ) {
    const activeIndex = steps.findIndex((step) => progress < step.doneAt)
    const activeLabel =
      activeIndex === -1 ? 'Preparando tu propuesta' : steps[activeIndex].label

    return (
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <div className="mx-auto w-full max-w-md lg:mx-0">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#dce3d5] bg-[#eef2e7] px-3 py-1.5 text-[11px] font-semibold text-[#496143]">
            <Loader2
              className="size-3.5 motion-safe:animate-spin"
              aria-hidden="true"
            />
            {inputMode === 'url'
              ? 'Leyendo tu web'
              : 'Leyendo tu ficha de Google'}
          </p>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-3xl leading-tight font-semibold tracking-[-0.04em] text-[#2b3b26] outline-none sm:text-4xl"
          >
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#687064] sm:text-base sm:leading-7">
            {subtitle}
          </p>

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-xs text-[#7b8271]">
              <span id="crear-progress-label">Progreso del análisis</span>
              <span className="font-medium text-[#2b3b26] tabular-nums">
                {progress}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-labelledby="crear-progress-label"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              className="h-1.5 w-full overflow-hidden rounded-full bg-[#e4e7dc]"
            >
              <div
                className="h-full rounded-full bg-[#29492e] motion-safe:transition-[width] motion-safe:duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ol className="mt-8 space-y-1">
            {steps.map((step, index) => {
              const done = progress >= step.doneAt
              const active = index === activeIndex

              return (
                <li
                  key={step.label}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                    active && 'bg-white ring-1 ring-[#e3e6da]',
                    done || active ? 'text-[#2b3b26]' : 'text-[#9aa08f]'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex size-5 shrink-0 items-center justify-center rounded-full',
                      done && 'bg-[#29492e] text-white',
                      active && 'border border-[#9fb38a] text-[#5b714c]',
                      !done && !active && 'border border-[#dde1d3]'
                    )}
                  >
                    {done ? (
                      <Check className="size-3" />
                    ) : active ? (
                      <Loader2 className="size-3 motion-safe:animate-spin" />
                    ) : null}
                  </span>
                  <span className={cn(active && 'font-medium')}>
                    {step.label}
                  </span>
                  <span className="sr-only">
                    {done ? '(hecho)' : active ? '(en curso)' : '(pendiente)'}
                  </span>
                </li>
              )
            })}
          </ol>

          <p aria-live="polite" aria-atomic="true" className="sr-only">
            {activeLabel}
          </p>
          <p className="mt-6 text-xs leading-5 text-[#8a9180]">
            {inputMode === 'url'
              ? 'Leer una web puede tardar hasta un minuto. No cierres esta página.'
              : 'Solo tarda unos segundos. Usamos únicamente datos públicos.'}
          </p>
        </div>

        {/* Skeleton of the site being generated */}
        <div aria-hidden="true" className="min-w-0">
          <div className="overflow-hidden rounded-xl border border-[#d9dfcf] bg-white shadow-[0_22px_55px_-28px_#425a3e40]">
            <div className="flex h-10 items-center gap-3 border-b border-[#e8e9df] px-3">
              <div className="flex gap-1">
                <span className="size-1.5 rounded-full bg-[#e0dfd5]" />
                <span className="size-1.5 rounded-full bg-[#e0dfd5]" />
                <span className="size-1.5 rounded-full bg-[#e0dfd5]" />
              </div>
              <span className="flex flex-1 items-center justify-center gap-1.5 truncate text-[10px] text-[#929688]">
                <Globe2 className="size-2.5 shrink-0" />
                {businessName
                  ? `${slugifyHost(businessName)}.bunnatic.com`
                  : 'tunegocio.bunnatic.com'}
              </span>
            </div>
            <div className="bg-[#f6f5ef] motion-safe:animate-pulse">
              <div className="flex items-center justify-between px-5 py-4">
                {businessName ? (
                  <span className="truncate font-serif text-base text-[#2b3b26]">
                    {businessName}
                  </span>
                ) : (
                  <span className="h-3 w-28 rounded bg-[#e3e5da]" />
                )}
                <span className="h-6 w-20 rounded-full bg-[#e3e5da]" />
              </div>
              <div className="space-y-3 bg-[#e7eadf] px-5 py-12 sm:px-8 sm:py-16">
                <span className="block h-2.5 w-32 rounded bg-[#d6dacb]" />
                <span className="block h-7 w-3/4 rounded bg-[#d6dacb]" />
                <span className="block h-7 w-1/2 rounded bg-[#d6dacb]" />
                <span className="mt-6 block h-8 w-32 rounded-full bg-[#d6dacb]" />
              </div>
              <div className="grid gap-4 px-5 py-6 sm:grid-cols-3 sm:px-8">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="space-y-2">
                    <span className="block h-3 w-2/3 rounded bg-[#e3e5da]" />
                    <span className="block h-2 w-full rounded bg-[#eceee5]" />
                    <span className="block h-2 w-5/6 rounded bg-[#eceee5]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

export default CreateAnalyzing

export function slugifyHost(name: string) {
  return name.toLowerCase().replace(/\s+/g, '')
}
