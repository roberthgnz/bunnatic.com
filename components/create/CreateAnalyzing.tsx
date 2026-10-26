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
          <p className="mb-6 inline-flex items-center gap-2 text-[13px] font-medium text-[#6b6b66]">
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
            className="text-4xl leading-[1] font-medium tracking-[-0.05em] text-balance text-[#0b0b0b] outline-none sm:text-5xl"
          >
            {title}
          </h1>
          <p className="mt-5 text-base leading-7 text-[#6b6b66]">{subtitle}</p>

          <div className="mt-10">
            <div className="mb-2.5 flex items-center justify-between text-xs text-[#6b6b66]">
              <span id="crear-progress-label">Progreso del análisis</span>
              <span className="font-medium text-[#0b0b0b] tabular-nums">
                {progress}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-labelledby="crear-progress-label"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              className="h-1 w-full overflow-hidden rounded-full bg-black/10"
            >
              <div
                className="h-full rounded-full bg-[#0b0b0b] motion-safe:transition-[width] motion-safe:duration-300"
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
                    'flex items-center gap-3 rounded-full px-3.5 py-2.5 text-sm transition-colors',
                    active && 'bg-[#f3f3ef]',
                    done || active ? 'text-[#0b0b0b]' : 'text-black/35'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex size-5 shrink-0 items-center justify-center rounded-full',
                      done && 'bg-[#0b0b0b] text-white',
                      active && 'border border-black/30 text-[#0b0b0b]',
                      !done && !active && 'border border-black/15'
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
          <p className="mt-6 text-xs leading-5 text-[#6b6b66]">
            {inputMode === 'url'
              ? 'Leer una web puede tardar hasta un minuto. No cierres esta página.'
              : 'Solo tarda unos segundos. Usamos únicamente datos públicos.'}
          </p>
        </div>

        {/* Skeleton of the site being generated */}
        <div aria-hidden="true" className="min-w-0">
          <div className="overflow-hidden rounded-2xl border border-[#e6e6e1] bg-white shadow-[0_30px_70px_-40px_rgba(0,0,0,0.35)]">
            <div className="flex h-10 items-center gap-3 border-b border-[#e6e6e1] px-3">
              <div className="flex gap-1">
                <span className="size-1.5 rounded-full bg-black/15" />
                <span className="size-1.5 rounded-full bg-black/15" />
                <span className="size-1.5 rounded-full bg-black/15" />
              </div>
              <span className="flex flex-1 items-center justify-center gap-1.5 truncate text-[10px] text-black/45">
                <Globe2 className="size-2.5 shrink-0" />
                {businessName
                  ? `${slugifyHost(businessName)}.locavo.com`
                  : 'tunegocio.locavo.com'}
              </span>
            </div>
            <div className="bg-[#f7f7f4] motion-safe:animate-pulse">
              <div className="flex items-center justify-between px-5 py-4">
                {businessName ? (
                  <span className="truncate font-serif text-base text-[#0b0b0b]">
                    {businessName}
                  </span>
                ) : (
                  <span className="h-3 w-28 rounded bg-[#e6e6e1]" />
                )}
                <span className="h-6 w-20 rounded-full bg-[#e6e6e1]" />
              </div>
              <div className="space-y-3 bg-[#ebebe6] px-5 py-12 sm:px-8 sm:py-16">
                <span className="block h-2.5 w-32 rounded bg-[#dcdcd6]" />
                <span className="block h-7 w-3/4 rounded bg-[#dcdcd6]" />
                <span className="block h-7 w-1/2 rounded bg-[#dcdcd6]" />
                <span className="mt-6 block h-8 w-32 rounded-full bg-[#dcdcd6]" />
              </div>
              <div className="grid gap-4 px-5 py-6 sm:grid-cols-3 sm:px-8">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="space-y-2">
                    <span className="block h-3 w-2/3 rounded bg-[#e6e6e1]" />
                    <span className="block h-2 w-full rounded bg-[#efefea]" />
                    <span className="block h-2 w-5/6 rounded bg-[#efefea]" />
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
