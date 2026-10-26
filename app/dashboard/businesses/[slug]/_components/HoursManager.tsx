'use client'

import { useState } from 'react'
import { z } from 'zod'
import { saveWorkingHours } from '@/lib/backoffice/actions/hours'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Loader2, Save, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

type HoursRow = {
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

const hoursRowSchema = z
  .object({
    day_of_week: z.number().int().min(0).max(6),
    open_time: z.string().regex(timeRegex, { message: 'time_format' }),
    close_time: z.string().regex(timeRegex, { message: 'time_format' }),
    is_closed: z.boolean(),
  })
  .refine(
    (row) => {
      if (row.is_closed) return true
      return row.open_time < row.close_time
    },
    { message: 'time_order', path: ['close_time'] }
  )

const hoursSchema = z.array(hoursRowSchema)

/** Week starts on Monday in Spain; values are day_of_week indexes. */
const displayOrder = [1, 2, 3, 4, 5, 6, 0]

export default function HoursManager({
  businessId,
  readOnly = false,
  initialHours,
}: {
  businessId: string
  readOnly?: boolean
  initialHours: HoursRow[]
}) {
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<
    Record<number, string>
  >({})
  const router = useRouter()

  const days = [0, 1, 2, 3, 4, 5, 6]
  const [hoursState, setHoursState] = useState<HoursRow[]>(() => {
    const map = new Map(initialHours.map((h) => [h.day_of_week, h]))
    return days.map((day) => ({
      day_of_week: day,
      open_time: map.get(day)?.open_time || '09:00',
      close_time: map.get(day)?.close_time || '18:00',
      is_closed: map.get(day)?.is_closed ?? (day === 0 || day === 6),
    }))
  })

  const t = {
    title: 'Horario de apertura',
    description:
      'Marca los días que abres y a qué hora. Se muestra en tu web pública.',
    save: 'Guardar horario',
    days: [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ],
    open: 'Abierto',
    closed: 'Cerrado',
    closedAllDay: 'Cerrado todo el día',
    from: 'Apertura',
    to: 'Cierre',
    saved: 'Horario guardado',
    pendingErrors: 'Hay errores pendientes de corregir',
    footerHint: 'Los cambios no se aplican hasta que guardes el horario.',
    errors: {
      time_format: 'Formato de hora no válido',
      time_order: 'La hora de cierre debe ser posterior a la de apertura',
    },
  }

  function updateDay(
    index: number,
    field: keyof HoursRow,
    value: string | boolean
  ) {
    setHoursState((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
    setValidationErrors((prev) => {
      const next = { ...prev }
      delete next[index]
      return next
    })
  }

  async function handleSave() {
    const result = hoursSchema.safeParse(hoursState)
    if (!result.success) {
      const errorMap: Record<number, string> = {}
      result.error.issues.forEach((issue) => {
        const dayIndex = Number(issue.path[0])
        if (!isNaN(dayIndex)) {
          const msgKey = issue.message as keyof typeof t.errors
          errorMap[dayIndex] = t.errors[msgKey] ?? issue.message
        }
      })
      setValidationErrors(errorMap)
      toast.error(Object.values(errorMap)[0] ?? 'Error de validación')
      return
    }
    setValidationErrors({})
    setLoading(true)
    const res = await saveWorkingHours(businessId, hoursState)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success(t.saved)
      router.refresh()
    }
    setLoading(false)
  }

  const hasErrors = Object.keys(validationErrors).length > 0
  const openDays = hoursState.filter((day) => !day.is_closed).length

  return (
    <fieldset disabled={readOnly} className="min-w-0 space-y-3">
      {readOnly ? (
        <p role="status" className="text-muted-foreground text-sm">
          Puedes consultar esta sección. Solo el propietario puede modificar el
          contenido.
        </p>
      ) : null}
      <div className="max-w-3xl space-y-5 pb-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-foreground text-base font-semibold tracking-[-0.01em]">
              {t.title}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {t.description}
            </p>
          </div>
          <Button onClick={handleSave} disabled={loading} className="shrink-0">
            {loading ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : (
              <Save aria-hidden="true" />
            )}
            {t.save}
          </Button>
        </div>

        <section
          aria-labelledby="hours-week-title"
          className="bg-card ring-border overflow-hidden rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1"
        >
          <div className="border-border flex items-center justify-between gap-3 border-b px-5 py-3.5">
            <h3
              id="hours-week-title"
              className="text-foreground text-sm font-medium"
            >
              Semana tipo
            </h3>
            <p className="text-muted-foreground text-xs">
              <span className="text-foreground font-semibold tabular-nums">
                {openDays}
              </span>{' '}
              de 7 días abiertos
            </p>
          </div>

          <ul className="divide-border divide-y">
            {displayOrder.map((index) => {
              const day = hoursState[index]
              const dayName = t.days[day.day_of_week]
              const dayLower = dayName.toLowerCase()
              const hasError = !!validationErrors[index]
              const errorId = `hours-error-${day.day_of_week}`
              const switchId = `hours-open-${day.day_of_week}`

              return (
                <li
                  key={day.day_of_week}
                  className={cn(
                    'grid items-center gap-x-4 gap-y-3 px-5 py-3.5 transition-colors sm:grid-cols-[132px_120px_minmax(0,1fr)]',
                    hasError && 'bg-destructive/5'
                  )}
                >
                  {/* Day */}
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        'size-2 shrink-0 rounded-full transition-colors',
                        day.is_closed ? 'bg-muted-foreground/30' : 'bg-success'
                      )}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        'text-sm font-medium',
                        day.is_closed
                          ? 'text-muted-foreground'
                          : 'text-foreground'
                      )}
                    >
                      {dayName}
                    </span>
                  </div>

                  {/* Open / closed toggle */}
                  <div className="flex items-center gap-2.5">
                    <Switch
                      id={switchId}
                      checked={!day.is_closed}
                      onCheckedChange={(checked) =>
                        updateDay(index, 'is_closed', !checked)
                      }
                      aria-label={`Abierto el ${dayLower}`}
                    />
                    <Label
                      htmlFor={switchId}
                      aria-hidden="true"
                      className={cn(
                        'cursor-pointer text-sm font-normal',
                        day.is_closed
                          ? 'text-muted-foreground'
                          : 'text-foreground'
                      )}
                    >
                      {day.is_closed ? t.closed : t.open}
                    </Label>
                  </div>

                  {/* Times */}
                  {day.is_closed ? (
                    <p className="text-muted-foreground/80 text-sm">
                      {t.closedAllDay}
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Input
                          type="time"
                          value={day.open_time}
                          onChange={(e) =>
                            updateDay(index, 'open_time', e.target.value)
                          }
                          aria-label={`${t.from} del ${dayLower}`}
                          aria-invalid={hasError}
                          aria-describedby={hasError ? errorId : undefined}
                          className="h-8 w-[7.5rem] tabular-nums"
                        />
                        <span
                          className="text-muted-foreground text-sm"
                          aria-hidden="true"
                        >
                          a
                        </span>
                        <Input
                          type="time"
                          value={day.close_time}
                          onChange={(e) =>
                            updateDay(index, 'close_time', e.target.value)
                          }
                          aria-label={`${t.to} del ${dayLower}`}
                          aria-invalid={hasError}
                          aria-describedby={hasError ? errorId : undefined}
                          className="h-8 w-[7.5rem] tabular-nums"
                        />
                      </div>
                      {hasError && (
                        <p
                          id={errorId}
                          className="text-destructive flex items-center gap-1 text-xs font-medium"
                        >
                          <AlertCircle
                            className="size-3 shrink-0"
                            aria-hidden="true"
                          />
                          {validationErrors[index]}
                        </p>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="border-border bg-muted/40 border-t px-5 py-3">
            <p
              className={cn(
                'flex items-center gap-1.5 text-xs',
                hasErrors
                  ? 'text-destructive font-medium'
                  : 'text-muted-foreground'
              )}
            >
              {hasErrors ? (
                <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
              ) : null}
              {hasErrors ? t.pendingErrors : t.footerHint}
            </p>
          </div>
        </section>
      </div>
    </fieldset>
  )
}
