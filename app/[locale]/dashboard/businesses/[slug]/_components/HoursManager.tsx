'use client'

import { useState } from 'react'
import { z } from 'zod'
import { saveWorkingHours } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Loader2, Save, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

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

export default function HoursManager({
  businessId,
  initialHours,
  locale,
}: {
  businessId: string
  initialHours: any[]
  locale: string
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
    es: {
      title: 'Horario de apertura',
      description: 'Define cuándo está abierto tu negocio.',
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
      closed: 'Cerrado',
      from: 'Abre',
      to: 'Cierra',
      saved: 'Horario guardado',
      errors: {
        time_format: 'Formato de hora inválido',
        time_order: 'El cierre debe ser posterior a la apertura',
      },
    },
    ca: {
      title: "Horari d'obertura",
      description: 'Defineix quan està obert el teu negoci.',
      save: 'Desar horari',
      days: [
        'Diumenge',
        'Dilluns',
        'Dimarts',
        'Dimecres',
        'Dijous',
        'Divendres',
        'Dissabte',
      ],
      closed: 'Tancat',
      from: 'Obre',
      to: 'Tanca',
      saved: 'Horari desat',
      errors: {
        time_format: "Format d'hora invàlid",
        time_order: "El tancament ha de ser posterior a l'obertura",
      },
    },
  }[locale === 'ca' ? 'ca' : 'es']

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

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-900">{t.title}</h3>
        <p className="mt-0.5 text-xs text-slate-500">{t.description}</p>
      </div>

      <div className="space-y-2 px-6 py-5">
        {hoursState.map((day, index) => {
          const hasError = !!validationErrors[index]
          return (
            <div
              key={day.day_of_week}
              className={`grid items-center gap-3 rounded-lg border px-4 py-3 transition-colors md:grid-cols-[160px_auto_1fr] ${
                hasError
                  ? 'border-red-200 bg-red-50/40'
                  : day.is_closed
                    ? 'border-slate-100 bg-slate-50/40'
                    : 'border-slate-200 bg-white'
              }`}
            >
              {/* Day name */}
              <p
                className={`text-sm font-medium ${day.is_closed ? 'text-slate-400' : 'text-slate-800'}`}
              >
                {t.days[day.day_of_week]}
              </p>

              {/* Closed toggle */}
              <div className="flex items-center gap-2">
                <Switch
                  id={`closed-${day.day_of_week}`}
                  checked={day.is_closed}
                  onCheckedChange={(checked) =>
                    updateDay(index, 'is_closed', checked)
                  }
                />
                <Label
                  htmlFor={`closed-${day.day_of_week}`}
                  className={`text-xs ${day.is_closed ? 'text-slate-400' : 'text-slate-500'}`}
                >
                  {t.closed}
                </Label>
              </div>

              {/* Time inputs or error */}
              {day.is_closed ? (
                <span className="text-xs text-slate-300">—</span>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-9 shrink-0 text-xs text-slate-400">
                        {t.from}
                      </span>
                      <Input
                        type="time"
                        value={day.open_time}
                        onChange={(e) =>
                          updateDay(index, 'open_time', e.target.value)
                        }
                        aria-invalid={hasError}
                        className="h-8 w-28 text-sm"
                      />
                    </div>
                    <span className="text-slate-300">→</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-9 shrink-0 text-xs text-slate-400">
                        {t.to}
                      </span>
                      <Input
                        type="time"
                        value={day.close_time}
                        onChange={(e) =>
                          updateDay(index, 'close_time', e.target.value)
                        }
                        aria-invalid={hasError}
                        className="h-8 w-28 text-sm"
                      />
                    </div>
                  </div>
                  {hasError && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {validationErrors[index]}
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/40 px-6 py-3">
        <p className="text-xs text-slate-400">
          {hasErrors ? '● Hay errores pendientes de corregir' : ''}
        </p>
        <Button onClick={handleSave} disabled={loading} size="sm">
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {t.save}
        </Button>
      </div>
    </div>
  )
}
